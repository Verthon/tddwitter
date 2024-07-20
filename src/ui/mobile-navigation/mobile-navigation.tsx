import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar/avatar";

export const MobileNavigation = () => {
	return (
		<div className="flex justify-between items-center">
			<Avatar>
				<AvatarImage src="https://github.com/shadcn.png" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
			<p>Tddwitter</p>
			<p className="invisible"></p>
		</div>
	);
};
