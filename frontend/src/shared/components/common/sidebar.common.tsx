import { useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { FaShoppingBag } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import {
	MdCategory,
	MdHomeRepairService,
	MdKeyboardArrowLeft,
	MdKeyboardArrowRight,
	MdKeyboardDoubleArrowLeft,
	MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { RiAlignItemRightFill } from 'react-icons/ri';
import { SiGoogletagmanager } from 'react-icons/si';
import { Link, useLocation } from 'react-router';
import { authThunk } from '@auth';
import { useAppDispatch } from '@hooks';

const sideBarNavs: { label: string; Icon: IconType; path: string }[] = [
	{ label: 'Products', Icon: RiAlignItemRightFill, path: '/' },
	{ label: 'Orders', Icon: FaShoppingBag, path: '/orders' },
	{ label: 'suppliers', Icon: MdHomeRepairService, path: '/suppliers' },
	{ label: 'categories', Icon: MdCategory, path: '/categories' },
];
export const SideBar = () => {
	const [currentPath, setCurrentPath] = useState<string>('products');
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();

	const dispatch = useAppDispatch();

	useEffect(() => {
		const setPathName = () => {
			setCurrentPath(location.pathname);
		};
		setPathName();
	}, [location.pathname]);

	return (
		<aside
			className={`flex flex-col gap-2 py-2  bg-gray-50/20 rounded shadow-sm ${isOpen ? 'min-w-[270px]' : 'min-w-[80px] '} transition-width duration-300`}
		>
			{/* Logo */}
			<section className="pl-6 h-16 flex items-center relative">
				<Link to={'/'} className="text-black h-fit w-fit">
					<SiGoogletagmanager size={25} />
				</Link>
				<button
					onClick={() => setIsOpen((prev) => !prev)}
					className={`absolute ${isOpen ? '-right-4' : '-right-6'} -translate-y-1/2 top-1/2 bg-transparent  p-1 rounded  text-gray-500`}
				>
					{isOpen ? <MdKeyboardArrowLeft size={30} /> : <MdKeyboardArrowRight size={30} />}
				</button>
			</section>

			{/* Navs */}
			<nav className={`flex-1  `}>
				<ul className="flex flex-col gap-1  ">
					{sideBarNavs.map((navs, index) => (
						<NavLink key={navs.path} {...navs} currentPath={currentPath} isOpen={isOpen} />
					))}
				</ul>
			</nav>

			{/* Logout */}
			<button
				onClick={() => dispatch(authThunk.logout())}
				className=" w-full rounded pl-6 mb-16 cursor-pointer flex gap-2 items-center text-gray-600"
			>
				<IoIosLogOut size={25} />
				<span
					className={`capitalize overflow-hidden transition-all duration-300
   					 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
  					`}
				>
					logout
				</span>
			</button>
		</aside>
	);
};

const NavLink = ({
	path,
	label,
	currentPath,
	Icon,
	isOpen,
}: {
	path: string;
	label: string;
	currentPath: string;
	Icon: IconType;
	isOpen: boolean;
}) => {
	return (
		<li
			className={`w-full hover:bg-gray-100/40  z-10 pl-6  ${currentPath === path ? 'bg-gray-100/60 text-primary' : 'text-gray-600'} `}
		>
			<Link className={`pl-1 py-4 flex items-center gap-3 text-lg`} to={path}>
				<Icon size={20} />

				<span
					className={`capitalize overflow-hidden transition-all duration-300
   					 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
  					`}
				>
					{label}
				</span>
			</Link>
		</li>
	);
};
