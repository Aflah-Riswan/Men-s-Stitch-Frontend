import { Search, ShoppingCart, User, Menu, Heart, LogInIcon, LogOutIcon, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../redux/slice/authSlice';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCategories } from '../../redux/slice/categorySlice';

const Navbar = () => {
  const { userAccessToken } = useSelector((state) => state.auth);
  
  const [searchParams] = useSearchParams();
  const initialSearch = decodeURIComponent(searchParams.get('search') || '');
  
  const [search, setSearch] = useState(initialSearch);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.category.items)
  const location = useLocation();

  useEffect(() => {
     setSearch(decodeURIComponent(searchParams.get('search') || ''));
  }, [searchParams]);

    useEffect(() => {
      dispatch(fetchCategories())
    }, [dispatch])

  const getCurrentCategory = () => {
     const pathSegments = location.pathname.split('/');
     const isCategoryPage = (pathSegments[1] === 'products' || pathSegments[1] === 'category') && pathSegments[2];
     return isCategoryPage ? pathSegments[2] : 'all';
  };

  const normalizeSearch = (term) => {
    return term.replace(/\bt[\s-]?shirt/gi, "t-shirt");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === '') {
       const category = getCurrentCategory();
       navigate(`/products/${category}`);
    }
  };

  const handleClear = () => {
    setSearch('');
    navigate(`/`);
  };

  function handleSearch(e) {
    if (e.key === 'Enter' || e.type === 'click') {
      if (search.trim()) {
        const category = getCurrentCategory();
        const cleanSearch = normalizeSearch(search.trim());

        navigate(`/products/${category}?search=${encodeURIComponent(cleanSearch)}`);
      }
    }
  }

  const handleCategoryClick = (category) => {
    navigate(`/products/${category}`);
  };

 return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1240px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between">

        {/* Logo & Menu */}
        <div className="flex items-center gap-4">
          <button className="block md:hidden">
            <Menu className="w-6 h-6 text-black" />
          </button>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
            Men's Stitch
          </h1>

          {/* 4. Dynamic Category List */}
          <ul className="hidden md:flex gap-6 text-base font-medium text-gray-800 ml-10">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <li 
                  key={cat._id} // Assuming your DB uses _id
                  className="cursor-pointer hover:text-gray-500 capitalize" 
                  onClick={() => handleCategoryClick(cat.categoryName)}
                >
                  {cat.categoryName}
                </li>
              ))
            ) : (
              // Optional: Show a few default items or a skeleton if loading fails/is slow
              <>
               <li className="text-gray-400">Loading...</li>
              </>
            )}
          </ul>
        </div>

        {/* Search Bar */}
        <div className="hidden md:block flex-1 max-w-xl px-8">
          <div className="relative group">
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer" 
              onClick={handleSearch} 
            />
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={handleInputChange} 
              className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-10 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              onKeyDown={handleSearch}
            />
            {search && (
              <button 
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5 md:gap-6">
           <button className="block md:hidden">
            <Search className="w-6 h-6 text-black" />
          </button>
          <button className="hidden md:block hover:scale-110 transition">
            <Heart className="w-6 h-6 text-black stroke-[1.5]" onClick={() => navigate('/wishlist')} />
          </button>
          <button className="hover:scale-110 transition" onClick={() => navigate('/cart')}>
            <ShoppingCart className="w-6 h-6 text-black stroke-[1.5]" />
          </button>
          <button className="hover:scale-110 transition" onClick={() => navigate('/profile')}>
            <User className="w-6 h-6 text-black stroke-[1.5]" />
          </button>
          <button className="hover:scale-110 transition flex items-center gap-2" onClick={() => dispatch(setLogout())}>
            {userAccessToken ? (
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