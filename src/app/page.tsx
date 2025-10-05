import { Button, Center, Text, Title } from "@mantine/core";

export default function HomePage() {
  return (
    <Center style={{
        height: '100vh', display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // center all children horizontally
        gap: 8,               // optional spacing between lines
        textAlign: 'center', overflow: 'visible'
    }}
        p={6}>

        <img
            src="/welcomebg.png"
            alt="background"
            style={{
                minWidth: "721px",
                width: '75%',
                height: '75%',
                objectFit: 'contain', // entire image visible
                objectPosition: 'center',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)', // centers the image
                zIndex: 0,
            }}
        />

        <Title style={{ zIndex: 1 }} order={1} fw={500} fz={{ base: 24, xs: 32, sm: 40, md: 48, lg: 64 }}>Your Journey to Mastery</Title>
        <Title style={{ zIndex: 1 }} order={1} fw={500} fz={{ base: 24, xs: 32, sm: 40, md: 48, lg: 64 }}>
            Starts with a <Text fw={800} component="span" c="primary.6" inherit>Snap</Text>
        </Title>

        <Title style={{ zIndex: 1 }} fz={{ base: 12, xs: 12, sm: 16, md: 20, lg: 26 }} fw={400} className='description'>
            An AI-powered tool that turns curiosity into growth
        </Title>
        <Button
            component="a"
            href="/auth/login?returnTo=http://localhost:3000/home"
            bg="primary.6"
            ff={'heading'}
        >
            Get Started
        </Button>

    </Center>
);}
