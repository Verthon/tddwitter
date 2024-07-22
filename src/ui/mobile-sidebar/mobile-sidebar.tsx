import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar/avatar";

export const MobileSidebarHeader = () => {
	return (
		<div className="p-4 text-left">
			<div className="justify-between items-center">
				<Avatar aria-label="User profile menu">
					<AvatarImage src="https://github.com/shadcn.png" />
					<AvatarFallback>TW</AvatarFallback>
				</Avatar>
			</div>
			<div className="flex flex-col mt-2">
				<a href="/">
					<strong>User Name</strong>
				</a>
				<a href="/" className="text-slate-500">
					<p>@test</p>
				</a>
			</div>
			<div className="mt-3">
				<a href="/" className="me-2">
					<span className="font-semibold">0</span> following
				</a>
				<a href="/">
					<span className="font-semibold">0</span> followers
				</a>
			</div>
		</div>
	);
};

export const MobileSidebarLinksList = () => {};
