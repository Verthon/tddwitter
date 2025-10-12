import { Avatar } from 'src/ui/avatar/Avatar';
import { Text } from 'src/ui/text/Text';

interface TimelineItemProps {
  avatar: string;
  username: string;
  content: string;
}

export const TimelineItem = ({ avatar, username, content }: TimelineItemProps) => {
  const headingId = `timeline-item-${username}-${Date.now()}`;

  return (
    <article
      className="flex gap-3 py-4 px-3 border-b last:border-b-0"
      aria-labelledby={headingId}
      data-testid="timeline-item"
    >
      <Avatar src={avatar} alt={`${username}'s avatar`} size={40} />

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="truncate">
          <Text weight="bold" as="div" id={headingId}>
            {username}
          </Text>
        </div>
        <Text size="sm" as="p">
          {content}
        </Text>
      </div>
    </article>
  );
};