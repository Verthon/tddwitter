import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar/avatar";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTrigger,
	DrawerTitle,
	DrawerDescription,
} from "@/ui/drawer/drawer";
import { MobileSidebarHeader } from "../mobile-sidebar/mobile-sidebar";

export const MobileNavigation = () => {
	return (
		<Drawer direction="left">
			<div className="flex justify-between items-center">
				<DrawerTrigger>
					<Avatar aria-label="User profile menu">
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>TW</AvatarFallback>
					</Avatar>
				</DrawerTrigger>
				<p>Tddwitter</p>
				<p className="invisible"></p>
			</div>
			<DrawerPortal>
				<DrawerOverlay className="fixed inset-0" />
				<DrawerContent className="bg-white flex flex-col h-full w-[300px] mt-24 fixed bottom-0 right-0">
					<DrawerTitle><p className="sr-only">Sidebar with user meta information and navigation links</p></DrawerTitle>
					<DrawerDescription><span className="sr-only">Sidebar allows navigation around the service and to display most crucial user information</span></DrawerDescription>
					<DrawerHeader>
						<MobileSidebarHeader />
					</DrawerHeader>
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	);
};
