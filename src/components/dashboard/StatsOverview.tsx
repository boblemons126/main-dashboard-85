import React from 'react';
import { Link } from 'react-router-dom';
import { statsData } from './dashboardConfig';

const StatsOverview = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat, index) => {
        if (stat.linkTo) {
          return (
            <Link
              key={index}
              to={stat.linkTo}
              className={`${stat.bgColor} backdrop-blur-md rounded-xl p-4 border ${stat.borderColor} hover:bg-white/20 transition-all duration-200 cursor-pointer block`}
            >
              <div className="flex items-center space-x-3">
                <div className={stat.color}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{stat.value}</div>
                  <div className="text-white/60 text-xs">{stat.label}</div>
                </div>
              </div>
            </Link>
          );
        }

        return (
          <div
            key={index}
            className={`${stat.bgColor} backdrop-blur-md rounded-xl p-4 border ${stat.borderColor} hover:bg-white/20 transition-all duration-200`}
          >
            <div className="flex items-center space-x-3">
              <div className={stat.color}>
                {stat.icon}
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{stat.value}</div>
                <div className="text-white/60 text-xs">{stat.label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview; 