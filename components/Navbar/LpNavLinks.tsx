import { LpNavCompanies, LpNavJobs, LpNavServices } from '../../lib/data/lp-nav-links-data'

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu"

export function LpNavLinks() {
    return (
        <NavigationMenu>
            <NavigationMenuList className='hidden lg:flex'>

                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">Jobs</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="bg-white/10 text-white flex flex-row items-start w-[600px] gap-5 p-5">
                            {LpNavJobs?.map((item: any) => (
                                <li key={item?.id}>
                                    <h4 className='font-bold mb-3'>{item?.title}</h4>
                                    <div className='flex flex-col'>
                                        {item?.subCat?.map((subCatItem: any) => (
                                            <div key={subCatItem?.id} className='text-sm trans cursor-pointer py-1 px-3 rounded-md text-white/40 hover:bg-white/[0.05]'>
                                                {subCatItem?.subCatTitle}
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem >
                    <NavigationMenuTrigger className="bg-transparent">Companies</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="bg-white/10 text-white flex flex-row items-start w-[600px] gap-5 p-5">
                            {LpNavCompanies?.map((item: any) => (
                                <li key={item?.id}>
                                    <h4 className='font-bold mb-3'>{item?.title}</h4>
                                    <div className='flex flex-col'>
                                        {item?.subCat?.map((subCatItem: any) => (
                                            <div key={subCatItem?.id} className='text-sm trans cursor-pointer py-1 px-3 rounded-md text-white/40 hover:bg-white/[0.05]'>
                                                {subCatItem?.subCatTitle}
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">Services</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="bg-white/10 text-white flex flex-row items-start w-[600px] gap-5 p-5">
                            {LpNavServices?.map((item: any) => (
                                <li key={item?.id}>
                                    <h4 className='font-bold mb-3'>{item?.title}</h4>
                                    <div className='flex flex-col'>
                                        {item?.subCat?.map((subCatItem: any) => (
                                            <div key={subCatItem?.id} className='text-sm trans cursor-pointer py-1 px-3 rounded-md text-white/40 hover:bg-white/[0.05]'>
                                                {subCatItem?.subCatTitle}
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

            </NavigationMenuList>
        </NavigationMenu>
    )
}

