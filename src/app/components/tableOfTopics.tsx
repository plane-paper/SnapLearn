import { Box, Button, Center, Flex, Grid, Table, Text } from '@mantine/core';
import { formatTime } from '../../lib/helpers';

interface TableOfTopicsProps  {
  topicJson: TopicJson
  setNewCourseStep: React.Dispatch<React.SetStateAction<0|1|2|3>>
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

export default function TableOfTopics(props: TableOfTopicsProps) {
  const toc = processTableOfContents(props.topicJson);
  const totalTime = getTotalReadingTime(props.topicJson);

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
      <Button variant={'light'} c={'blue'} onClick={()=>props.setNewCourseStep(0) }>
        Back
      </Button>
    </Center>
  );
}
