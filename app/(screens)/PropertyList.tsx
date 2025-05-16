import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { fetchProperties } from "../../services/api";

const ITEMS_PER_PAGE = 10; // Assumption based on API
const MAX_VISIBLE_PAGES = 5;

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadPage = async (pageNum: number) => {
    setLoading(true);
    try {
      const json = await fetchProperties(pageNum);
      setProperties(json.data || []);
      setTotalPages(Math.ceil(json.count / ITEMS_PER_PAGE));
      setPage(pageNum);
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPage(page);
  }, []);

  const renderItem = ({ item }) => {
    const room = item.rooms?.[0];
    const img = item.society_images?.[0]?.image_url?.trim();

    return (
      <View className="mb-6 rounded-xl overflow-hidden bg-white shadow-xl">
        <Image
          source={img ? { uri: img } : require("../../assets/default-room.png")}
          className="w-full h-40"
          resizeMode="cover"
        />
        <View className="px-4 py-2">
          <Text className="text-lg font-bold">{room?.name}</Text>
          <Text className="text-sm text-gray-500">{item.name}, {item.area1}, {item.city}</Text>
          <View className="flex-row justify-between mt-2">
            <Text className="text-sm">₹{room?.total_rent?.toLocaleString()}/mo</Text>
            <Text className="text-sm">{room?.features?.find(f => f.key === "Floor")?.value}</Text>
            <Text className="text-sm">{room?.available_for}</Text>
          </View>
          <View className="flex-row flex-wrap gap-2 mt-2">
            {item.nearby?.slice(0, 2).map((place, idx) => (
              <Text key={idx} className="bg-gray-100 px-2 py-1 rounded-full text-xs">➕ {place.title}</Text>
            ))}
            {item.nearby?.length > 2 && (
              <Text className="text-xs px-2 py-1 rounded-full bg-gray-100">+{item.nearby.length - 2}</Text>
            )}
          </View>
          <View className="grid grid-cols-2 gap-2 mt-4">
            <TouchableOpacity className="border border-purple-600 rounded-xl px-4 py-2">
              <Text className="text-purple-600 font-medium text-center">Get a callback</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-purple-600 rounded-xl px-4 py-2">
              <Text className="text-white font-medium text-center">Schedule a visit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderPagination = () => {
    const startPage = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGES / 2));
    const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          className={`px-3 py-1 rounded-full mx-1 ${page === i ? "bg-purple-600" : "bg-gray-200"}`}
          onPress={() => loadPage(i)}
        >
          <Text className={`${page === i ? "text-white" : "text-black"}`}>{i}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View className="flex-row justify-center mt-4">
        {page > 1 && (
          <TouchableOpacity className="px-3 py-1 rounded-full bg-gray-300 mx-1" onPress={() => loadPage(page - 1)}>
            <Text>«</Text>
          </TouchableOpacity>
        )}
        {pages}
        {page < totalPages && (
          <TouchableOpacity className="px-3 py-1 rounded-full bg-gray-300 mx-1" onPress={() => loadPage(page + 1)}>
            <Text>»</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 px-4 py-2 bg-gray-50">
      {loading ? (
        <ActivityIndicator className="mt-8" size="large" />
      ) : (
        <>
          <FlatList
            data={properties}
            keyExtractor={(item, index) => item.id + "-" + index}
            renderItem={renderItem}
            ListFooterComponent={<View className="h-4" />}
          />
          {renderPagination()}
        </>
      )}
    </View>
  );
}
