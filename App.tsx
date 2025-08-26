import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from '@/routes/Router'
import Root from '@/shared/infra/Root'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root>
      <Router />
    </Root>
  </StrictMode>,
)
