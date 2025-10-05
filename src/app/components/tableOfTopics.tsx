import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  NumberInput,
  Paper,
  Slider,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { formatTime } from '../../lib/helpers';
import { useState } from 'react';
import { IconArrowLeft, IconArrowRight, IconBook, IconClock } from '@tabler/icons-react';

interface TableOfTopicsProps {
  topicJson: TopicJson;
  setNewCourseStep: React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3>>;
  leasonTime: number;
  setLessonTime: React.Dispatch<React.SetStateAction<number>>;
}

function processTableOfContents(topicJson: TopicJson): TableOfContentsItem[] {
  return topicJson.topics.entries.map((entry, index) => ({
    title: entry.title,
    page: entry.page,
    readingTime: formatTime(entry.time),
    level: entry.level,
    chapter: index + 1,
  }));
}

// Get total reading time
function getTotalReadingTime(topicJson: TopicJson): string {
  const totalMinutes = topicJson.topics.entries.reduce(
    (sum, entry) => sum + entry.time,
    0
  );
  return formatTime(totalMinutes);
}

function calculateTime(hour: number, minute: number): number {
  return hour * 60 + minute;
}

export default function TableOfTopics(props: TableOfTopicsProps) {
  const toc = processTableOfContents(props.topicJson);
  const totalTime = getTotalReadingTime(props.topicJson);
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);

  return (
    <Box style={{ maxWidth: 900, width: '70%' }}>
      <Stack gap="xl">
        {/* Header */}
        <Box>
          <Title order={2} mb="xs">Table of Contents</Title>
          <Text size="sm" c="dimmed">
            Review your course structure and set your daily learning time
          </Text>
        </Box>

        {/* Table Card */}
        <Paper shadow="sm" radius="md" withBorder  style={{overflow:'hidden'}}>
          <Table 
            striped 
            highlightOnHover
            styles={{
              th: {
                fontWeight: 600,
                fontSize: '14px',
                padding: '16px',
                background: 'var(--mantine-color-gray-0)',
              },
              td: {
                padding: '12px 16px',
              }
            }}
            bdrs={'md'}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Chapter</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Page</Table.Th>
                <Table.Th>
                  <Group gap="xs">
                    <IconClock size={16} />
                    <span>Time</span>
                  </Group>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {toc.map((item) => (
                <Table.Tr key={item.chapter}>
                  <Table.Td>
                    <Badge variant="light" size="lg">
                      {item.chapter}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {item.title}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {item.page}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="outline" color="blue">
                      {item.readingTime}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {/* Total Time Footer */}
          <Box 
            p="md" 
            style={{ 
              background: 'var(--mantine-color-blue-0)',
              borderTop: '1px solid var(--mantine-color-gray-3)'
            }}
          >
            <Group justify="space-between">
              <Group gap="xs">
                <IconBook size={20} />
                <Text fw={600} size="sm">Total Reading Time</Text>
              </Group>
              <Badge size="lg" variant="filled">
                {totalTime}
              </Badge>
            </Group>
          </Box>
        </Paper>

        {/* Learning Time Card */}
        <Paper shadow="sm" radius="md" p="lg" withBorder>
          <Stack gap="lg">
            <Box>
              <Group gap="xs" mb="xs">
                <IconClock size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
                <Title order={4} fw={600}>Daily Learning Time</Title>
              </Group>
              <Text size="sm" c="dimmed">
                Set how much time you want to dedicate each day
              </Text>
            </Box>

            <Flex gap="md">
              <NumberInput
                label="Hours"
                placeholder="0"
                max={23}
                min={0}
                size="lg"
                flex={1}
                value={hour}
                onChange={(v) => setHour(v as number)}
                styles={{
                  input: {
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 600,
                  }
                }}
              />
              <NumberInput
                label="Minutes"
                placeholder="0"
                max={59}
                min={0}
                size="lg"
                flex={1}
                value={minute}
                onChange={(v) => setMinute(v as number)}
                styles={{
                  input: {
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 600,
                  }
                }}
              />
            </Flex>

            {(hour > 0 || minute > 0) && (
              <Paper p="sm" radius="md" style={{ background: 'var(--mantine-color-blue-0)' }}>
                <Text size="sm" ta="center" fw={500} c="blue">
                  You'll study for {hour > 0 && `${hour}h `}{minute > 0 && `${minute}min`} per day
                </Text>
              </Paper>
            )}
          </Stack>
        </Paper>

        {/* Navigation Buttons */}
        <Group gap="sm">
          <Button
            variant="light"
            size="lg"
            flex={1}
            onClick={() => props.setNewCourseStep(0)}
            leftSection={<IconArrowLeft size={18} />}
          >
            Back
          </Button>
          <Button
            size="lg"
            flex={1}
            onClick={() => {
              calculateTime(hour, minute);
              props.setNewCourseStep(2);
            }}
            rightSection={<IconArrowRight size={18} />}
            disabled={hour === 0 && minute === 0}
          >
            Continue
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
