import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Sparkles, 
  TrendingUp, 
  Lightbulb, 
  Users, 
  RefreshCw,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const PremiumNavigation = ({ activeTab, setActiveTab, onRefresh, loading }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'My Stats', icon: BarChart3, badge: null },
    { id: 'simulator', label: 'Premium AI', icon: Sparkles, badge: 'New' },
    { id: 'analysis', label: 'Analysis', icon: TrendingUp, badge: null },
    { id: 'class', label: 'Class View', icon: Users, badge: '12' }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleTabClick = (tabId) => {
    // Smooth tab transition with haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    
    // Smooth scroll to top on mobile
    if (window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="glass-nav-container">
          <div className="flex items-center justify-between">
            {/* Tab Navigation */}
            <div className="flex items-center space-x-2">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`nav-tab-premium ${isActive ? 'active' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon size={16} />
                      <span className="font-medium">{tab.label}</span>
                      {tab.badge && (
                        <motion.span
                          className="nav-badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {tab.badge}
                        </motion.span>
                      )}
                    </div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="nav-active-indicator"
                        layoutId="activeTab"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Refresh Button */}
            <motion.button
              onClick={handleRefresh}
              disabled={loading}
              className="refresh-button-premium"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: isRefreshing ? 1 : 0.2 }}
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              <span className="ml-2 font-medium">Refresh</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="glass-nav-container-mobile">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-button"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="ml-2 font-medium">
                {tabs.find(tab => tab.id === activeTab)?.label || 'Menu'}
              </span>
              <ChevronDown 
                size={16} 
                className={`ml-1 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} 
              />
            </motion.button>

            <motion.button
              onClick={handleRefresh}
              disabled={loading}
              className="refresh-button-mobile"
              whileTap={{ scale: 0.95 }}
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: isRefreshing ? 1 : 0.2 }}
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </motion.button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence mode="wait">
          {isMobileMenuOpen && (
            <motion.div
              className="mobile-dropdown mobile-scroll-container"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ 
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`mobile-tab-item ${isActive ? 'active' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.03,
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    whileTap={{ 
                      scale: 0.96,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={18} />
                      <span className="font-medium">{tab.label}</span>
                      {tab.badge && (
                        <span className="mobile-badge">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <motion.div
                        className="mobile-active-dot"
                        layoutId="mobileActiveTab"
                        transition={{ type: "spring", bounce: 0.3 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PremiumNavigation;