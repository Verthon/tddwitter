import { createMockResponse } from '../../integrations/mockUtils';

const engagementApiBase = import.meta.env.PUBLIC_ENGAGEMENT_API;

export const mockEngagementResponse = createMockResponse(engagementApiBase);
