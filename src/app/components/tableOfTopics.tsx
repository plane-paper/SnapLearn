import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  NumberInput,
  Slider,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { formatTime } from '../../lib/helpers';
import { useState } from 'react';

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
    <Center
      style={{
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Chapter</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Page</Table.Th>
            <Table.Th>Reading Time</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {toc.map((item) => (
            <Table.Tr key={item.chapter}>
              <Table.Td>{item.chapter}</Table.Td>
              <Table.Td>{item.title}</Table.Td>
              <Table.Td>{item.page}</Table.Td>
              <Table.Td>{item.readingTime}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Text mt="md" fw={500}>
        Total Reading Time: {totalTime}
      </Text>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 12,
          margin: '12px 0px',
        }}
        bd="2px solid var(--mantine-color-blue-6)"
        bdrs="var(--mantine-radius-md)"
        p="md"
      >
        {/* <Flex justify={'space-between'}> */}
        <Title order={6}>Set your desired time for each lesson: </Title>
        {/* <Title order={4}>{props.leasonTime} min</Title> */}
        {/* </Flex> */}

        {/* <Slider
          color="blue"
          size="sm"
          value={props.leasonTime}
          domain={[0, 180]}
          max={180}
          marks={[
            { value: 60, label: '60 min' },
            { value: 120, label: '120 min' },
          ]}
          style={{ width: '100%', marginBottom: '16px' }}
          onChange={(v) => props.setLessonTime(v)}
        ></Slider> */}
        <Flex style={{ gap: '16px', width: '100%' }}>
          <NumberInput
            label="Hour"
            placeholder="Hour"
            max={23}
            min={0}
            w={'50%'}
            value={hour}
            onChange={(v) => setHour(v as number)}
          ></NumberInput>
          <NumberInput
            label="Minute"
            placeholder="Minute"
            max={59}
            min={0}
            w={'50%'}
            value={minute}
            onChange={(v) => setMinute(v as number)}
          ></NumberInput>
        </Flex>
      </Box>
      <Flex w={'100%'} gap={'sm'}>
        <Button
          variant={'light'}
          c={'blue'}
          onClick={() => props.setNewCourseStep(0)}
          fullWidth
        >
          Back
        </Button>
        <Button
          onClick={() => {
            calculateTime(hour, minute);
            props.setNewCourseStep(2);
          }}
          fullWidth
        >
          Next
        </Button>
      </Flex>
    </Center>
  );
}
