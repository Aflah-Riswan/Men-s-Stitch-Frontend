

import { Search, ShoppingCart, User, Menu, Heart, LogInIcon, LogOutIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../redux/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const { accessToken, role } = useSelector((state) => state.auth)
  const [search, setSearch] = useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log("accesstoken  : ", accessToken)

  function handleSearch(e) {
    if (e.key === 'Enter' || e.type === 'click') {
      if (search.trim()) {
        navigate(`/products/all?search=${encodeURIComponent(search)}`);
         setSearch(''); 
      }
    }
  }
  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">

     
      <div className="max-w-[1240px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between">

       
        <div className="flex items-center gap-4">

          
          <button className="block md:hidden">
            <Menu className="w-6 h-6 text-black" />
          </button>

          
          <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">
            Men's Stitch
          </h1>

          
          <ul className="hidden md:flex gap-6 text-base font-medium text-gray-800 ml-10">
            <li className="cursor-pointer hover:text-gray-500">Shirts</li>
            <li className="cursor-pointer hover:text-gray-500">Trousers</li>
            <li className="cursor-pointer hover:text-gray-500">Innerwears</li>
            <li className="cursor-pointer hover:text-gray-500">T-Shirts</li>
          </ul>
        </div>

  
        <div className="hidden md:block flex-1 max-w-xl px-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              onKeyDown={handleSearch}
            />
          </div>
        </div>

       
        <div className="flex items-center gap-5 md:gap-6">

          
          <button className="block md:hidden">
            <Search className="w-6 h-6 text-black" />
          </button>

          <button className="hidden md:block hover:scale-110 transition">
            <Heart className="w-6 h-6 text-black stroke-[1.5]" />
          </button>

        
          <button className="hover:scale-110 transition">
            <ShoppingCart className="w-6 h-6 text-black stroke-[1.5]" />
          </button>

          <button className="hover:scale-110 transition">
            <User className="w-6 h-6 text-black stroke-[1.5]" />
          </button>

          <button className="hover:scale-110 transition flex items-center gap-2" onClick={() => dispatch(setLogout())}>
            {accessToken ? (
              <>
                <LogOutIcon className="w-6 h-6 text-black stroke-[1.5]" />
                <span className="text-sm font-medium">Logout</span>
              </>
            ) : (
              <>
                <LogInIcon className="w-6 h-6 text-black stroke-[1.5]" onClick={() => navigate('/login')} />
                <span className="text-sm font-medium">Login</span>
              </>
            )}
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;