import { Shell } from '../core/shell/Shell';
import { TimelineList } from './timeline-list/TimeLineList';
import { FloatingActionsContainer } from '../ui/floatingActionsContainer/FloatingActionsContainer';
import { ScrollToTopButton } from '../core/scroll/components/ScrollToTopButton';
import { CreatePost } from '../composer/components/CreatePost';
import { SignedIn } from '../core/auth/components/SignedIn';

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
