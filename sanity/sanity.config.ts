import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import AdminDashboard from './components/AdminDashboard'

export default defineConfig({
  basePath: '/studio',
  name: 'default',
  title: 'Little Locals Premium',
  projectId: 'oyeriaey',
  dataset: 'production',
  useCdn: false,
  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  tools: (prev) => {
    return [
      ...prev,
      {
        name: 'dashboard',
        title: 'Dashboard',
        icon: () => '📊',
        component: AdminDashboard,
      },
    ]
  },
})
