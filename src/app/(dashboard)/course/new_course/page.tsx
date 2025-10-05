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
  Loader,
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

export default function NewCourse() {
  const { user, isLoading } = useUser();
  const [sideBarStatus, setSideBarStatus] = useState<boolean>(false);
  const [isFileProcessed, setIsFileProcessed] = useState<boolean>(false);
  const [newCourseStep, setNewCourseStep] = useState<0 | 1 | 2 | 3>(0);
  const [lessonTime, setLessonTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topicData, setTopicData] = useState(null);
  const [file, setFile] = useState<File | null>(null);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan>({lesson_list:[]});

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('Received data:', data);

      setTopicData(data.topics);

      // Move to next step with the data
      setNewCourseStep(1);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        display: 'flex',
        height: '100vh',
        background: '#f8f9fa',
        minHeight: 'fit-content',
      }}
    >
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
                  Start your learning journey by uploading a PDF document
                </Text>
              </Box>

              {/* Upload Area */}
              <FileButton onChange={setFile} accept=".pdf">
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
              {file && (
                <Button
                  fullWidth
                  size="lg"
                  disabled={loading}
                  mt="md"
                  onClick={() => {
                    handleUpload();
                  }}
                >
                  {loading ? <Loader size="sm" /> : 'Process File'}
                </Button>
              )}
              {error && (
                <Text c="red">
                  {error}
                </Text>
              )}

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
            setLessonPlan={setLessonPlan}
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
          <StudyPlan setNewCourseStep={setNewCourseStep} lessonPlan={lessonPlan as LessonPlan}/>
        </Box>
      )}
      {newCourseStep == 3 && <FinishPage />}
    </Box>
  );
}
