'use client';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Burger,
  Button,
  Center,
  Divider,
  Drawer,
  FileButton,
  Flex,
  NavLink,
  TableOfContents,
  Text,
  Title,
  Card,
  Group,
  Progress,
  Stack,
} from '@mantine/core';
import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import {
  IconChevronRight,
  IconHome,
  IconLayoutSidebarLeftExpand,
  IconUpload,
  IconBook,
  IconCirclePlus,
} from '@tabler/icons-react';
import TableOfTopics from '../../components/tableOfTopics';

const navList = [
  {
    href: '/home',
    label: 'Home',
  },
];

const topicJson = {
  topics: {
    entries: [
      {
        level: 1,
        page: 1,
        time: 42,
        title: 'Chapter 1: Europe in 1914',
      },
      {
        level: 1,
        page: 15,
        time: 36,
        title: 'Chapter 2: The Coming of War',
      },
    ],
    total_entries: 2,
  },
};

export default function Home() {
  const { user, isLoading } = useUser();
  const [sideBarStatus, setSideBarStatus] = useState<boolean>(false);
  const [isFileProcessed, setIsFileProcessed] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [courses, setCourses] = useState<{ id: number; name: string; progress: number }[]>([]);
  const hasCourses = courses.length > 0;

  return (
    <Box style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar can be added here later */}

      {/* Main Content */}
      <Center style={{ flex: 1, padding: 32 }}>
        <Box w="100%">
          <Title order={2} mb="md" ta="center">
            My Dashboard
          </Title>

          {hasCourses ? (
            <Stack gap="md">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  shadow="sm"
                  p="lg"
                  radius="md"
                  withBorder
                  style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Group justify="space-between" align="center">
                    <Group>
                      <IconBook size={22} />
                      <Box>
                        <Text fw={600}>{course.name}</Text>
                        <Text size="sm" c="dimmed">
                          Progress: {course.progress}%
                        </Text>
                      </Box>
                    </Group>
                    <Progress value={course.progress} w={150} />
                  </Group>
                </Card>
              ))}
            </Stack>
          ) : (
            <Center style={{ height: '60vh' }}>
              <Stack align="center" gap="md">
                <IconBook size={48} color="#868e96" />
                <Title order={4}>No active courses yet</Title>
                <Text c="dimmed" ta="center">
                  It looks like you haven’t started any courses. <br />
                  Explore our tutorials to begin learning!
                </Text>
                <Button
                  leftSection={<IconCirclePlus size={18} />}
                  variant="filled"
                  color="blue"
                  onClick={() => {
                    window.location.href = '/course';
                  }}
                >
                  Explore Courses
                </Button>
              </Stack>
            </Center>
          )}
        </Box>
      </Center>
    </Box>
  );
}
