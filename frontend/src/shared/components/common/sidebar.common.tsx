import { useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { FaShoppingBag } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import { MdCategory, MdHomeRepairService } from 'react-icons/md';
import { RiAlignItemRightFill } from 'react-icons/ri';
import { SiGoogletagmanager } from 'react-icons/si';
import { Link, useLocation } from 'react-router';
import { authThunk } from '@auth';
import { useAppDispatch } from '@hooks';

export const SideBar = () => {
	const [currentPath, setCurrentPath] = useState<string>('products');

	const location = useLocation();

	const dispatch = useAppDispatch();

	useEffect(() => {
		const setPathName = () => {
			setCurrentPath(location.pathname);
		};
		setPathName();
	}, [location.pathname]);
	return (
		<aside className="flex flex-col gap-2 py-2 min-w-[270px] bg-gray-50/20 rounded shadow-sm">
			{/* Logo */}
			<section className="pl-6 h-16 flex items-center">
				<Link to={'/'} className="text-black h-fit w-fit">
					<SiGoogletagmanager size={35} />
				</Link>
			</section>

			{/* Navs */}
			<nav className="flex-1  flex flex-col justify-between">
				<ul className="flex flex-col gap-1 w-full ">
					<NavLink lable="Products" pathName="/" currentPath={currentPath} Icon={RiAlignItemRightFill} />
					<NavLink lable="Orders" pathName="/orders" currentPath={currentPath} Icon={FaShoppingBag} />
					<NavLink
						lable="Suppliers"
						pathName="/suppliers"
						currentPath={currentPath}
						Icon={MdHomeRepairService}
					/>
					<NavLink lable="Categories" pathName="/categories" currentPath={currentPath} Icon={MdCategory} />
				</ul>
			</nav>

			{/* Logout */}
			<button
				onClick={() => dispatch(authThunk.logout())}
				className=" w-full rounded pl-6 mb-16 cursor-pointer flex gap-2 items-center text-gray-600"
			>
				<IoIosLogOut size={35} />
				<span className="text-gray-600">Logout</span>
			</button>
		</aside>
	);
};

const NavLink = ({
	pathName,
	lable,
	currentPath,
	Icon,
}: {
	pathName: string;
	lable: string;
	currentPath: string;
	Icon: IconType;
}) => {
	return (
		<li
			className={`w-full hover:bg-gray-100/40  z-10 pl-6  ${currentPath === pathName ? 'bg-gray-100/60 text-primary' : 'text-gray-600'}`}
		>
			<Link className={`pl-1 py-4 flex items-center gap-3 text-lg`} to={pathName}>
				<Icon size={25} />
				{lable}
			</Link>
		</li>
	);
};
