"use client";

import { Button, createTheme } from "@mantine/core";

export const theme = createTheme({
  /* Put your mantine theme override here */
  fontFamily: 'Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: { fontFamily: 'Montserrat, sans-serif' },
  colors:{'primary': [ '#CAF0F8', '#ADE8F4', '#90E0EF', '#48CAE4', '#00B4D8','#009ED8', '#0081C7', '#0061B6', '#023E8A', '#03045E'],},
  components: {
    NavLink: {
      styles: {
        label: {
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 400,
        },
      },
    },
    Button: {
      styles: {
        label: {
          fontFamily: "Montserrat, sans-serif",
        },
      },
    },
  },
});
