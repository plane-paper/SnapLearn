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
  Paper,
  Stack,
  TableOfContents,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import {
  IconChevronRight,
  IconFileText,
  IconHome,
  IconLayoutSidebarLeftExpand,
  IconUpload,
} from '@tabler/icons-react';
import TableOfTopics from '../../../components/tableOfTopics';
import StudyPlan from './studyPlan';
import FinishPage from './finishPage';

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
      {
        level: 1,
        page: 27,
        time: 30,
        title: 'Chapter 3: 1914: The Opening Campaigns',
      },
      {
        level: 1,
        page: 37,
        time: 57,
        title: 'Chapter 4: 1915: The War Continues',
      },
      {
        level: 1,
        page: 56,
        time: 36,
        title: 'Chapter 5: 1916: The War of Attrition',
      },
      {
        level: 1,
        page: 68,
        time: 39,
        title: 'Chapter 6: The United States Enters the War',
      },
      {
        level: 1,
        page: 81,
        time: 42,
        title: 'Chapter 7: 1917: The Year of Crisis',
      },
      {
        level: 1,
        page: 95,
        time: 54,
        title: 'Chapter 8: 1918: The Year of Decision',
      },
      {
        level: 1,
        page: 113,
        time: 33,
        title: 'Chapter 9: The Settlement',
      },
    ],
    total_entries: 9,
  },
};
export default function Home() {
  const { user, isLoading } = useUser();
  const [sideBarStatus, setSideBarStatus] = useState<boolean>(false);
  const [isFileProcessed, setIsFileProcessed] = useState<boolean>(false);
  const [newCourseStep, setNewCourseStep] = useState<0 | 1 | 2 | 3>(0);
  const [lessonTime, setLessonTime] = useState<number>(0);

  const [file, setFile] = useState<File | null>(null);

  return (
    <Box
      style={{
        display: 'flex',
        height: '100vh',
        background: '#f8f9fa',
        minHeight: 'fit-content',
      }}
    >
      {/* Sidebar Toggle */}
      {/* <ActionIcon
        onClick={() => setSideBarStatus((o) => !o)}
        size="xl"
        variant="subtle"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 0,
        }}
      >
        <IconLayoutSidebarLeftExpand size={28} />
      </ActionIcon> */}

      {/* Sidebar Drawer */}
      {/* <Drawer
        opened={sideBarStatus}
        onClose={() => setSideBarStatus(false)}
        withCloseButton={false}
        size={280}
        styles={{
          content: {
            background: 'white',
            boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
          },
          body: {
            padding: 'var(--mantine-spacing-lg)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
          root: { zIndex: 1 },
        }}
      >
        
        <Box>
          {isLoading && <Text>Loading...</Text>}
          {user && (
            <Box mb="lg">
              <Flex align="center" gap="md">
                <Avatar color="blue" radius="xl" size="lg">
                  {user.name?.[0]}
                </Avatar>
                <Box style={{ flex: 1 }}>
                  <Text fw={600} size="sm">
                    {user.name?.substring(0, user.name.indexOf('@'))}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {user.email}
                  </Text>
                </Box>
              </Flex>
            </Box>
          )}

          <Divider my="md" />

          
          <Box>
            {navList.map((item, key) => (
              <NavLink
                key={key}
                href={item.href}
                label={item.label}
                leftSection={<IconHome size={18} stroke={1.5} />}
                rightSection={<IconChevronRight size={14} stroke={1.5} />}
                styles={{
                  root: {
                    borderRadius: 'var(--mantine-radius-md)',
                    marginBottom: '4px',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        <Button
          component="a"
          href="/auth/logout?returnTo=http://localhost:3000"
          variant="light"
          color="red"
          fullWidth
        >
          Log Out
        </Button>
      </Drawer> */}

      {/* Main Content */}
      {newCourseStep == 0 && (
        <Center style={{ flex: 1, padding: 32 }}>
          <Paper
            shadow="md"
            radius="lg"
            p="xl"
            style={{
              maxWidth: 500,
              width: '100%',
              background: 'white',
            }}
          >
            <Stack gap="xl" align="center">
              {/* Header */}
              <Box ta="center">
                <Title order={2} fw={600} mb="xs">
                  Upload Your Textbook
                </Title>
                <Text size="sm" c="dimmed">
                  Start your learning journey by uploading a PDF or Word
                  document
                </Text>
              </Box>

              {/* Upload Area */}
              <FileButton onChange={setFile} accept=".pdf,.doc,.docx">
                {(props) => (
                  <Paper
                    {...props}
                    withBorder
                    p="xl"
                    radius="md"
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                      border: file
                        ? '2px solid var(--mantine-color-blue-6)'
                        : '2px dashed var(--mantine-color-gray-4)',
                      background: file
                        ? 'var(--mantine-color-blue-0)'
                        : 'var(--mantine-color-gray-0)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Stack gap="md" align="center">
                      <ThemeIcon
                        size={64}
                        radius="xl"
                        variant="light"
                        color={file ? 'blue' : 'gray'}
                      >
                        {file ? (
                          <IconFileText size={32} />
                        ) : (
                          <IconUpload size={32} />
                        )}
                      </ThemeIcon>

                      <Box ta="center">
                        <Text fw={500} size="sm" mb={4}>
                          {file ? file.name : 'Click to upload'}
                        </Text>
                        <Text size="xs" c="dimmed">
                          PDF, DOC, or DOCX up to 10MB
                        </Text>
                      </Box>
                    </Stack>
                  </Paper>
                )}
              </FileButton>

              {/* Action Button */}
              <Button
                fullWidth
                size="lg"
                disabled={!file}
                onClick={() => {
                  console.log('Starting processing...');
                  setNewCourseStep(1);
                }}
              >
                Start Processing
              </Button>

              {/* Helper Text */}
              <Text size="xs" c="dimmed" ta="center">
                Your file will be processed securely and used only for creating
                your personalized study plan
              </Text>
            </Stack>
          </Paper>
        </Center>
      )}
      {newCourseStep == 1 && (
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            flex: 1,
            padding: 32,
          }}
          h={'fit-content'}
        >
          <TableOfTopics
            topicJson={topicJson}
            setNewCourseStep={setNewCourseStep}
            leasonTime={lessonTime}
            setLessonTime={setLessonTime}
          />
        </Box>
      )}
      {newCourseStep == 2 && (
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            flex: 1,
            padding: 32,
          }}
          h={'fit-content'}
        >
          <StudyPlan setNewCourseStep={setNewCourseStep} />
        </Box>
      )}
      {newCourseStep == 3 && <FinishPage />}
    </Box>
  );
}
