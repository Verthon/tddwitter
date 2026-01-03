import { Link } from 'react-router';
import { Avatar } from 'src/ui/avatar/Avatar';
import { Text } from 'src/ui/text/Text';
import { routesConfig } from 'src/routing/routesConfig';
import { LikeButton } from 'src/engagement/components/LikeButton';

interface TimelineItemProps {
  id: string;
  avatar: string;
  username: string;
  content: string;
}

export const TimelineItem = ({ id, avatar, username, content }: TimelineItemProps) => {
  const headingId = `timeline-item-heading-${id}`;
  const postUrl = routesConfig.post.replace(':id', id);

  return (
    <article
      className="relative flex gap-3 py-6 px-3 border-b last:border-b-0 border-gray-200 hover:bg-gray-50 transition-colors"
      aria-labelledby={headingId}
      data-testid="timeline-item"
    >
      <Link
        to={postUrl}
        className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset no-underline"
        aria-label={`View post by ${username}`}
      >
        <span className="sr-only">View post by {username}</span>
      </Link>

      <div className="relative z-10">
        <Avatar src={avatar} alt={`${username}'s avatar`} size={40} />
      </div>

      <div className="relative z-10 flex flex-col gap-1 flex-1 min-w-0">
        <div className="truncate">
          <Text weight="bold" as="div" id={headingId}>
            {username}
          </Text>
        </div>
        <Text size="sm" as="p">
          {content}
        </Text>
        <div className="mt-2">
          <LikeButton postId={id} />
        </div>
      </div>
    </article>
  );
};