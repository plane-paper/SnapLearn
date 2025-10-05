import { Box, Flex, Grid, Table, Text } from '@mantine/core';
import { formatTime } from '../../lib/helpers';

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

export default function TableOfTopics({ topicJson }: { topicJson: TopicJson }) {
  const toc = processTableOfContents(topicJson);
  const totalTime = getTotalReadingTime(topicJson);

  return (
    <Grid>
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
    </Grid>
  );
}
