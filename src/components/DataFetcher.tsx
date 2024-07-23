import React, { useEffect, useState } from "react";
import axios from "axios";

interface Park {
  id: number;
  title: string;
  active: boolean;
}

const DataFetcher: React.FC = () => {
  const [allData, setAllData] = useState<Park[]>([]);
  const [activeTrueData, setActiveTrueData] = useState<Park[]>([]);
  const [activeFalseData, setActiveFalseData] = useState<Park[]>([]);
  const [filter, setFilter] = useState<string>('All'); // Définissez 'All' comme valeur par défaut
  const [selectedData, setSelectedData] = useState<Park[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Park[]>("http://localhost:3000/parks");
        setAllData(response.data);
        setActiveTrueData(response.data.filter((item) => item.active));
        setActiveFalseData(response.data.filter((item) => !item.active));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const filterData = () => {
    if (filter === 'All') {
      setActiveTrueData(allData);
      setActiveFalseData(allData);
    } else if (filter === 'Active') {
      setActiveTrueData(allData.filter((item) => item.active));
      setActiveFalseData([]);
    } else if (filter === 'Inactive') {
      setActiveFalseData(allData.filter((item) => !item.active));
      setActiveTrueData([]);
    }
  };

  useEffect(() => {
    filterData();
  }, [allData, filter]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value); // Mettez à jour le filtre avec la valeur sélectionnée
  };

  const renderTable = (data: Park[], onClick: (item: Park) => void) => (
    <div className="flex justify-center py-10 hover:pointer-events-auto">
      {data.map((item, index) => (
        <div key={index} onClick={() => onClick(item)} className="mx-[20px] flex justify-between items-center bg-[#F1F1F1] h-[90px] w-[250px] rounded-xl shadow-xl">
          <span className="pl-[25px] text-[#1D204D]">{item.title}</span>
          <span className="mr-[20px]">
            <input type="checkbox" checked={item.active} onChange={(e) => { e.stopPropagation(); toggleActive(item.id); }} />
          </span>
        </div>
      ))}
    </div>
  );

  const toggleActive = (id: number) => {
    const newData = allData.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    setAllData(newData);
  };

  const handleSelect = (item: Park) => {
    if (!selectedData.some((selected) => selected.id === item.id)) {
      setSelectedData([...selectedData, item]);
    }
  };

  const handleDeselect = (item: Park) => {
    setSelectedData(selectedData.filter((selected) => selected.id !== item.id));
  };


  return (
    <><div className="bg-gradient-to-r from-gray-200 to-blue-200 min-h-screen">

    <div className="text-center py-[42px] font-light font-sans flex justify-center text-[40px]"> <div className="mr-4">P A R K</div><div className="ml-4">P I C K E R</div></div>
    <div className="flex flex-col justify-center items-center w-full">
      <div className="relative w-2/3  border-[#000] border-dashed border-2 rounded-md shadow-lg">
        <div className="w-full text-center mt-3"> <h2 className="text-[#1D204D]">I'd like to manage ...</h2></div>
       
        <div>
            {renderTable(selectedData, handleDeselect)}
        </div>
      </div>
      <div className="relative w-2/3 border-2 border-[#000] border-dashed mt-10 rounded-md">
        <div className="mt-3">
          <h2 className="w-full text-center text-[#1D204D]">Available Parks</h2>
        </div>
        
        <div className="ml-[10px] border-none">
          <select value={filter} id="filter" onChange={handleFilterChange} className="bg-[#f1f1f1]  border-none">
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          {filter === 'Active' && renderTable(activeTrueData, handleSelect)}
          {filter === 'Inactive' && renderTable(activeFalseData, handleSelect)}
          {filter === 'All' && (
            <>
              {renderTable(activeTrueData, handleSelect)}
            </>
          )}
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default DataFetcher;
