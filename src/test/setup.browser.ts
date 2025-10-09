import { beforeAll, afterEach, afterAll } from 'vitest';

import 'src/App.css';
import { resetHandlers, startMocking, stopMocking } from 'src/integrations/mockServer';

beforeAll(() => startMocking());
afterEach(() => resetHandlers());
afterAll(() => stopMocking());



