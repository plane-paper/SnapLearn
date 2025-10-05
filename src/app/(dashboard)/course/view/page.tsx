// app/(dashboard)/courses/view/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import {
  Badge,
  Box,
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
  Center,
} from '@mantine/core';
import { IconBook } from '@tabler/icons-react';

export default function ViewCoursePage() {
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState(0);

  useEffect(() => {
    // Load from sessionStorage
    const stored = sessionStorage.getItem('current_course');
    if (stored) {
      setCourse(JSON.parse(stored));
    } else {
      router.push('/courses/new_course');
    }
  }, []);

  if (!course) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  const lesson = course.lessons[currentLesson];

  return (
    <Box style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <Stack gap="xl">
        <Box>
          <Title order={2}>{course.textbook_name}</Title>
          <Text c="dimmed">
            Lesson {currentLesson + 1} of {course.total_lessons}
          </Text>
        </Box>

        <Paper shadow="sm" p="lg" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>Lesson {lesson.lesson_number}</Title>
              <Badge size="lg">{lesson.total_time} min</Badge>
            </Group>

            <Stack gap="xs">
              {lesson.topics.map((topic: any, idx: number) => (
                <Group key={idx} gap="sm">
                  <IconBook size={18} />
                  <Text size="sm">{topic.title}</Text>
                </Group>
              ))}
            </Stack>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="xl" withBorder>
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </Paper>

        <Group justify="space-between">
          <Button
            variant="light"
            disabled={currentLesson === 0}
            onClick={() => setCurrentLesson(currentLesson - 1)}
          >
            Previous
          </Button>
          <Button
            disabled={currentLesson === course.lessons.length - 1}
            onClick={() => setCurrentLesson(currentLesson + 1)}
          >
            Next
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
