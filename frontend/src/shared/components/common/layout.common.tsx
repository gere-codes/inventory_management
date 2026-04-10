import { SideBar } from './sidebar.common';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<section className="flex flex-row h-screen gap-2 p-2">
			{/* SideBar: Left side content */}
			<SideBar />

			{/* Pages: Right side content */}
			<section className="flex flex-col w-full overflow-y-auto px-4 py-2 rounded border border-gray-100">
				{children}
			</section>
		</section>
	);
};
