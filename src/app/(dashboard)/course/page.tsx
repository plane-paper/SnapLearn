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
  Badge,
  Paper,
  Loader,
} from '@mantine/core';
import { IconBook, IconPlus, IconClock, IconCalendar } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
  id: string;
  textbook_name: string;
  total_sessions: number;
  total_time: string;
  created_at: string;
  progress?: number;
}

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center style={{ flex: 1, minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  // No courses - show empty state
  if (courses.length === 0) {
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
              onClick={() => router.push('/courses/new_course')}
            >
              Create Your First Course
            </Button>
          </Stack>
        </Paper>
      </Center>
    );
  }

  // Has courses - show list
  return (
    <Box style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: 32 }}>
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between">
          <Box>
            <Title order={2} mb="xs">
              My Courses
            </Title>
            <Text c="dimmed">
              {courses.length} {courses.length === 1 ? 'course' : 'courses'} in progress
            </Text>
          </Box>
          <Button
            leftSection={<IconPlus size={20} />}
            onClick={() => router.push('/courses/new_course')}
          >
            New Course
          </Button>
        </Group>

        {/* Course List */}
        <Stack gap="md">
          {courses.map((course) => (
            <Card
              key={course.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ cursor: 'pointer' }}
              onClick={() => router.push(`/courses/${course.id}`)}
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
                        <IconCalendar size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                        <Text size="sm" c="dimmed">
                          {course.total_sessions} sessions
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <IconClock size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                        <Text size="sm" c="dimmed">
                          {course.total_time}
                        </Text>
                      </Group>
                    </Group>
                  </Box>
                </Group>

                <Stack gap="xs" align="flex-end">
                  {course.progress !== undefined && (
                    <Badge size="lg" variant="light">
                      {course.progress}% Complete
                    </Badge>
                  )}
                  <Button variant="light" size="sm">
                    Continue
                  </Button>
                </Stack>
              </Group>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}