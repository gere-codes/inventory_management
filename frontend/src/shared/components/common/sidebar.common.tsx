import { SiGoogletagmanager } from 'react-icons/si';

export const SideBar = () => {
	return (
		<section className="flex flex-row grap-2 px-4 py-2 min-w-[250px] bg-primary rounded">
			<h1 className="text-white">
				<SiGoogletagmanager size={35} />
			</h1>
		</section>
	);
};
