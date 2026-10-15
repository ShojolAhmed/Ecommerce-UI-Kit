// Register each new design here. The key is the public `variant` name.
import ClassicSidebar from './ClassicSidebar.jsx'
import CollapsibleSidebar from './CollapsibleSidebar.jsx'
import MinimalSidebar from './MinimalSidebar.jsx'

export const sidebarVariants = {
  classic: ClassicSidebar,
  collapsible: CollapsibleSidebar,
  minimal: MinimalSidebar,
}

export const DEFAULT_SIDEBAR_VARIANT = 'classic'
