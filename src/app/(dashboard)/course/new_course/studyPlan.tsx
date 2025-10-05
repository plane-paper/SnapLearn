import {
  Box,
  Text,
  Badge,
  Stack,
  Group,
  Card,
  Progress,
  Title,
  Button,
  Flex,
  Paper,
  Divider,
} from '@mantine/core';
import { IconBook, IconClock, IconCheckbox, IconCalendar, IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

interface Props {
  setNewCourseStep: React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3>>;
  lessonPlan: LessonPlan;
}

// Helper Functions
function formatTime(minutes: number): string {
  if (minutes === 0) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function processLessonPlan(lessonPlan: LessonPlan): ProcessedSession[] {
  return lessonPlan.lesson_list.map((session, index) => {
    const totalTime = session.reduce((sum, lesson) => sum + lesson.time, 0);
    const hasPractice = session.some((lesson) =>
      lesson.title.toLowerCase().includes('practice')
    );

    return {
      sessionNumber: index + 1,
      lessons: session,
      totalTime,
      hasPractice,
    };
  });
}

function getTotalStats(lessonPlan: LessonPlan) {
  const sessions = processLessonPlan(lessonPlan);
  const totalSessions = sessions.length;
  const totalTime = sessions.reduce((sum, s) => sum + s.totalTime, 0);
  const totalLessons = lessonPlan.lesson_list.flat().length;
  const practiceCount = sessions.filter((s) => s.hasPractice).length;

  return {
    totalSessions,
    totalTime: formatTime(totalTime),
    totalLessons,
    practiceCount,
  };
}

// Main Component
export default function StudyPlan(props: Props) {
  const lessonPlan: LessonPlan = props.lessonPlan

  const sessions = processLessonPlan(lessonPlan);
  const stats = getTotalStats(lessonPlan);

  return (
    <Box style={{ maxWidth: 1000, width: '100%' }}>
      <Stack gap="xl">
        {/* Header */}
        <Box>
          <Title order={2} mb="xs">Your Personalized Study Plan</Title>
          <Text size="sm" c="dimmed">
            Review your customized learning schedule with {stats.totalSessions} sessions
          </Text>
        </Box>

        {/* Summary Stats Card */}
        <Paper shadow="sm" radius="md" p="xl" withBorder>
          <Group justify="space-between" wrap="wrap" gap="xl">
            <Box>
              <Group gap="xs" mb="xs">
                <IconCalendar size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
                <Text size="sm" c="dimmed" fw={500}>Sessions</Text>
              </Group>
              <Text size="xl" fw={700}>{stats.totalSessions}</Text>
            </Box>
            <Box>
              <Group gap="xs" mb="xs">
                <IconClock size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
                <Text size="sm" c="dimmed" fw={500}>Total Time</Text>
              </Group>
              <Text size="xl" fw={700}>{stats.totalTime}</Text>
            </Box>
            <Box>
              <Group gap="xs" mb="xs">
                <IconBook size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
                <Text size="sm" c="dimmed" fw={500}>Lessons</Text>
              </Group>
              <Text size="xl" fw={700}>{stats.totalLessons}</Text>
            </Box>
            <Box>
              <Group gap="xs" mb="xs">
                <IconCheckbox size={20} style={{ color: 'var(--mantine-color-green-6)' }} />
                <Text size="sm" c="dimmed" fw={500}>Practice</Text>
              </Group>
              <Text size="xl" fw={700} c="green">{stats.practiceCount}</Text>
            </Box>
          </Group>
        </Paper>

        {/* Session List */}
        <Stack gap="md">
          {sessions.map((session) => (
            <Paper
              key={session.sessionNumber}
              shadow="sm"
              radius="md"
              withBorder
              style={{
                overflow: 'hidden',
              }}
            >
              {/* Session Header */}
              <Box p="md" style={{ background: 'var(--mantine-color-gray-0)' }}>
                <Group justify="space-between">
                  <Group gap="sm">
                    <Badge
                      size="lg"
                      variant="filled"
                      color={session.hasPractice ? 'green' : 'blue'}
                    >
                      Day {session.sessionNumber}
                    </Badge>
                    {session.hasPractice && (
                      <Badge
                        size="sm"
                        variant="light"
                        color="green"
                        leftSection={<IconCheckbox size={14} />}
                      >
                        Includes Practice
                      </Badge>
                    )}
                  </Group>
                  <Group gap="xs">
                    <IconClock size={18} />
                    <Text size="sm" fw={600}>
                      {formatTime(session.totalTime)}
                    </Text>
                  </Group>
                </Group>
              </Box>

              <Divider />

              {/* Lessons */}
              <Box p="md">
                <Stack gap="xs">
                  {session.lessons.map((lesson, idx) => (
                    <Group
                      key={idx}
                      gap="sm"
                      p="sm"
                      style={{
                        backgroundColor: lesson.title
                          .toLowerCase()
                          .includes('practice')
                          ? 'var(--mantine-color-green-0)'
                          : 'var(--mantine-color-blue-0)',
                        borderRadius: 'var(--mantine-radius-sm)',
                        border: '1px solid',
                        borderColor: lesson.title
                          .toLowerCase()
                          .includes('practice')
                          ? 'var(--mantine-color-green-2)'
                          : 'var(--mantine-color-blue-2)',
                      }}
                    >
                      <IconBook 
                        size={18} 
                        style={{ 
                          flexShrink: 0,
                          color: lesson.title.toLowerCase().includes('practice')
                            ? 'var(--mantine-color-green-6)'
                            : 'var(--mantine-color-blue-6)'
                        }} 
                      />
                      <Text size="sm" fw={500} style={{ flex: 1 }}>
                        {lesson.title}
                      </Text>
                      <Badge variant="outline" size="sm">
                        {formatTime(lesson.time)}
                      </Badge>
                    </Group>
                  ))}
                </Stack>
              </Box>
            </Paper>
          ))}
        </Stack>

        {/* Navigation Buttons */}
        <Group gap="sm">
          <Button
            variant="light"
            size="lg"
            flex={1}
            onClick={() => props.setNewCourseStep(1)}
            leftSection={<IconArrowLeft size={18} />}
          >
            Back
          </Button>
          <Button
            size="lg"
            flex={1}
            onClick={() => props.setNewCourseStep(3)}
            rightSection={<IconArrowRight size={18} />}
          >
            Confirm & Continue
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}

// Reusable Session Card Component
export function SessionCard({
  session,
  onClick,
}: {
  session: ProcessedSession;
  onClick?: () => void;
}) {
  return (
    <Card
      withBorder
      padding="md"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <Group justify="space-between">
        <Group gap="xs">
          <Badge variant="filled">Session {session.sessionNumber}</Badge>
          <Text size="sm" fw={500}>
            {session.lessons.length}{' '}
            {session.lessons.length === 1 ? 'lesson' : 'lessons'}
          </Text>
        </Group>
        <Group gap="xs">
          <IconClock size={16} />
          <Text size="sm">{formatTime(session.totalTime)}</Text>
        </Group>
      </Group>

      {session.hasPractice && (
        <Badge size="xs" variant="light" color="green" mt="xs">
          Includes Practice
        </Badge>
      )}
    </Card>
  );
}
