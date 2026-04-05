import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';

// Define a simple route order to determine transition direction
const routeOrder = [
  '/',
  '/dashboard',
  '/projects',
  '/projects/:id',
  '/invoices'
];

function getRouteIndex(path) {
  // match prefix for dynamic project route
  if (path.startsWith('/projects/') && path.split('/').length > 2) return routeOrder.indexOf('/projects/:id');
  const idx = routeOrder.indexOf(path);
  return idx === -1 ? 0 : idx;
}

export default function PageWrapper({ location, children }) {
  const prevIndex = useRef(getRouteIndex(location.pathname));
  const index = getRouteIndex(location.pathname);
  const direction = index >= prevIndex.current ? 1 : -1;
  prevIndex.current = index;

  const variants = {
    initial: (dir) => ({ opacity: 0, y: 20 * dir, pointerEvents: 'none' }),
    animate: { opacity: 1, y: 0, pointerEvents: 'auto', transition: { duration: 0.4, ease: 'easeOut' } },
    exit: (dir) => ({ opacity: 0, y: -20 * dir, pointerEvents: 'none', transition: { duration: 0.28, ease: 'easeIn' } })
  };

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={location.pathname}
        custom={direction}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ minHeight: '100%', width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
