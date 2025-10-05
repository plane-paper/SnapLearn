import {
  Box,
  Button,
  Text,
  Title,
  Stack,
  Group,
  ThemeIcon,
  getGradient,
  useMantineTheme,
} from '@mantine/core';
import { IconCheck, IconSparkles, IconArrowRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FinishPage() {
  const router = useRouter();
  const theme = useMantineTheme();
  const [countdown, setCountdown] = useState(5);
  const [autoRedirect, setAutoRedirect] = useState(true);

  // Auto redirect after 5 seconds
  useEffect(() => {
    if (!autoRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/course'); // Change to your course page route
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, autoRedirect]);

  const handleGoToCourses = () => {
    setAutoRedirect(false);
    router.push('/course'); // Change to your course page route
  };

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        minWidth:'100%',
        background: getGradient({ deg: 137, from: 'blue', to: 'cyan.7' }, theme),
        padding: 32,
      }}
    >
      <Box
        style={{
          maxWidth: 600,
          width: '100%',
          background: 'white',
          borderRadius: '24px',
          padding: '48px 32px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <Stack align="center" gap="xl">
          {/* Success Icon */}
          <ThemeIcon
            size={120}
            radius="xl"
            variant="light"
            color="green"
            style={{
              animation: 'bounce 1s ease-in-out',
            }}
          >
            <IconCheck size={60} stroke={3} />
          </ThemeIcon>

          {/* Title */}
          <Box>
            <Title order={1} size="h1" fw={700} mb="xs">
              Setup Complete! 🎉
            </Title>
            <Text size="lg" c="dimmed">
              Your course is ready to go
            </Text>
          </Box>

          {/* Features/Benefits */}
          <Stack gap="sm" align="stretch" w="100%">
            <Group gap="sm">
              <IconSparkles size={20} color="var(--mantine-color-violet-6)" />
              <Text size="sm">AI-powered learning path created</Text>
            </Group>
            <Group gap="sm">
              <IconSparkles size={20} color="var(--mantine-color-violet-6)" />
              <Text size="sm">Practice sessions scheduled</Text>
            </Group>
            <Group gap="sm">
              <IconSparkles size={20} color="var(--mantine-color-violet-6)" />
              <Text size="sm">Progress tracking enabled</Text>
            </Group>
          </Stack>

          {/* CTA Button */}
          <Button
            size="xl"
            fullWidth
            onClick={handleGoToCourses}
            rightSection={<IconArrowRight size={20} />}
            style={{
              background: getGradient({ deg: 137, from: 'blue', to: 'cyan.7' }, theme),
            }}
          >
            Go to My Courses
          </Button>

          {/* Auto redirect notice */}
          {autoRedirect && countdown > 0 && (
            <Text size="sm" c="dimmed">
              Redirecting automatically in {countdown} seconds...
            </Text>
          )}

          {/* Cancel auto redirect */}
          {autoRedirect && countdown > 0 && (
            <Button
              variant="subtle"
              size="sm"
              c="dimmed"
              onClick={() => setAutoRedirect(false)}
            >
              Cancel auto-redirect
            </Button>
          )}
        </Stack>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}</style>
      </Box>
    </Box>
  );
}