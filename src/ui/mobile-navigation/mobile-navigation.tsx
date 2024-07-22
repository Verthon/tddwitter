import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar/avatar";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTrigger,
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
					<DrawerHeader>
						<MobileSidebarHeader />
					</DrawerHeader>
					<DrawerFooter>
						<button>Submit</button>
						<DrawerClose>
							<button>Cancel</button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	);
};
