# @signozhq/table

## 0.3.0

### Minor Changes

- be0d2d6: Virtualized infinite scroll improvements:
  - Add IntersectionObserver-based sentinel for jiggle-free loadMore
  - Add column pin offsets for multiple pinned columns
  - Bind virtualization to a single scroll container
  - Improve near-end detection and throttling
  - Dark header styling and remove external table margins
  - Docs: story for virtualization + infinite scroll + DnD + resize

## 0.2.0

### Minor Changes

- 4c188bc: feat: enhance table component with height and overflow functionality
  - Add comprehensive fixedHeight prop support for table containers
  - Implement overflow handling with automatic scrolling
  - Add sticky headers functionality when fixedHeight is provided
  - Remove custom scrollbar styles for cleaner native experience
  - Add virtualization support with fixedHeight integration
  - Update documentation with detailed examples and usage
  - Add new stories demonstrating height and overflow features
  - Enhance example.tsx with virtualization demo
  - Improve README with comprehensive documentation
