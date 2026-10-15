import { CreatePost } from '../composer/components/CreatePost';
import { SignedIn } from '../core/auth/components/SignedIn';
import { ScrollToTopButton } from '../core/scroll/components/ScrollToTopButton';
import { Shell } from '../core/shell/Shell';
import { FloatingActionsContainer } from '../ui/floatingActionsContainer/FloatingActionsContainer';
import { TimelineList } from './timeline-list/TimeLineList';

const Timeline = () => {
  return (
    <>
      <Shell>
        <TimelineList />
      </Shell>
      <FloatingActionsContainer>
        <FloatingActionsContainer.Action position="bottom-left">
          <ScrollToTopButton />
        </FloatingActionsContainer.Action>
        <FloatingActionsContainer.Action position="bottom-right">
          <SignedIn>
            <CreatePost />
          </SignedIn>
        </FloatingActionsContainer.Action>
      </FloatingActionsContainer>
    </>
  );
};

export default Timeline;
