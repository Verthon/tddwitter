import { Avatar } from 'src/ui/avatar/Avatar';
import { Text } from 'src/ui/text/Text';

interface TimelineItemProps {
  avatar: string;
  username: string;
  content: string;
}

export const TimelineItem = ({ avatar, username, content }: TimelineItemProps) => {
  return (
    <article className="flex gap-3 py-4 px-3 border-b last:border-b-0">
      <Avatar src={avatar} alt={username} size={40} />

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <Text weight="bold" className="truncate">
          {username}
        </Text>
        <p className="whitespace-pre-wrap break-words text-sm text-gray-900">
          {content}
        </p>
      </div>
    </article>
  );
};