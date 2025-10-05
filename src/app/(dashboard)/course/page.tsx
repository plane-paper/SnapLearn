// app/(dashboard)/courses/page.tsx
'use client';
import {
  Box,
  Button,
  Card,
  Center,
  Group,
  Stack,
  Text,
  Title,
  Paper,
} from '@mantine/core';
import { IconBook, IconPlus, IconClock } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
  id: string;
  textbook_name: string;
  total_lessons: number;
  created_at: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    // Check if there's a course in sessionStorage
    const stored = sessionStorage.getItem('current_course');
    if (stored) {
      try {
        const parsedCourse = JSON.parse(stored);
        setCourse(parsedCourse);
      } catch (error) {
        console.error('Failed to parse stored course:', error);
      }
    }
  }, []);

  // No course - show empty state
  if (!course) {
    return (
      <Center style={{ flex: 1, minHeight: '100vh', padding: 32 }}>
        <Paper
          shadow="md"
          radius="lg"
          p="xl"
          style={{
            maxWidth: 500,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Stack gap="xl" align="center">
            <Box
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'var(--mantine-color-blue-0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconBook size={60} style={{ color: 'var(--mantine-color-blue-6)' }} />
            </Box>

            <Box>
              <Title order={2} mb="xs">
                No Courses Yet
              </Title>
              <Text c="dimmed">
                Create your first course by uploading a textbook
              </Text>
            </Box>

            <Button
              size="lg"
              leftSection={<IconPlus size={20} />}
              onClick={() => router.push('/course/new_course')}
            >
              Create Your First Course
            </Button>
          </Stack>
        </Paper>
      </Center>
    );
  }

  // Has course - show it
  return (
    <Box style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: 32 }}>
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between">
          <Box>
            <Title order={2} mb="xs">
              My Course
            </Title>
            <Text c="dimmed">
              Your current learning session
            </Text>
          </Box>
          <Button
            leftSection={<IconPlus size={20} />}
            onClick={() => {
              // Warn user they'll lose current course
              if (confirm('Creating a new course will replace your current one. Continue?')) {
                sessionStorage.removeItem('current_course');
                router.push('/course/new_course');
              }
            }}
          >
            New Course
          </Button>
        </Group>

        {/* Course Card */}
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{ cursor: 'pointer' }}
          onClick={() => router.push('/course/view')}
        >
          <Group justify="space-between" wrap="nowrap">
            <Group gap="md" style={{ flex: 1 }}>
              <Box
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 'var(--mantine-radius-md)',
                  background: 'var(--mantine-color-blue-0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconBook size={30} style={{ color: 'var(--mantine-color-blue-6)' }} />
              </Box>

              <Box style={{ flex: 1, minWidth: 0 }}>
                <Title order={4} mb={4} style={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {course.textbook_name}
                </Title>
                
                <Group gap="md">
                  <Group gap="xs">
                    <IconBook size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                    <Text size="sm" c="dimmed">
                      {course.total_lessons} lessons
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconClock size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                    <Text size="sm" c="dimmed">
                      Started {new Date(course.created_at).toLocaleDateString()}
                    </Text>
                  </Group>
                </Group>
              </Box>
            </Group>

            <Button variant="light" size="sm">
              Continue Learning
            </Button>
          </Group>
        </Card>

        {/* Info note */}
        <Paper p="md" radius="md" style={{ background: 'var(--mantine-color-yellow-0)' }}>
          <Text size="sm" c="dimmed">
            <strong>Note:</strong> Your course is stored temporarily in your browser. 
            It will be lost if you close this tab or clear your browser data.
          </Text>
        </Paper>
      </Stack>
    </Box>
  );
}