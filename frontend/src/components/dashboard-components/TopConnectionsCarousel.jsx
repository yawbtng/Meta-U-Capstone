import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import LoadingSpinner from "../ui/loading-spinner";
import AvatarDemo from "../avatar-01";

function getScoreColor(score) {
  if (score >= 70) return "bg-green-100 text-green-800";
  if (score >= 30) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const badgeColors = [
  "bg-purple-100 text-purple-800",
  "bg-green-100 text-green-800",
  "bg-blue-100 text-blue-800",
  "bg-orange-100 text-orange-800"
];

const TopConnectionsCarousel = ({ contacts, loading, plugin, onContactClick }) => {
  // Sort by connection_score descending, take top 5
  const topConnections = [...contacts]
    .filter(c => typeof c.connection_score === 'number')
    .sort((a, b) => b.connection_score - a.connection_score)
    .slice(0, 5);

  const handleContactClick = (connection) => {
    if (onContactClick) {
      onContactClick(connection);
    }
  };

  return (
    <div className="lg:col-span-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Connections
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <LoadingSpinner size={32} text="Loading top connections..." />
            </div>
          ) : topConnections.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">No connections to show.</div>
          ) : (
            <Carousel
              plugins={[plugin.current]}
              className="w-full h-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              opts={{
                align: "center",
                loop: true,
              }}
            >
              <CarouselContent className="h-full">
                {topConnections.map((connection, idx) => (
                  <CarouselItem key={connection.id} className="basis-full h-full">
                    <div className="flex justify-center items-center h-1/2">
                      <Card 
                        className="relative w-full max-w-[250px] h-[300px] flex flex-col items-center shadow-lg border-2 hover:shadow-xl transition-all duration-200 cursor-pointer"
                        onClick={() => handleContactClick(connection)}
                      >
                        {/* Rank badge top left */}
                        <div className="absolute top-4 left-4">
                          <span className="px-2 py-1 rounded text-lg font-semibold bg-gray-100 text-gray-700">#{idx + 1}</span>
                        </div>
                        {/* Score badge top right */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-2 py-1 rounded text-lg font-semibold ${getScoreColor(connection.connection_score)}`}>{connection.connection_score}</span>
                        </div>
                        <CardHeader className="flex flex-row items-center justify-center gap-4 pt-10 pb-2 w-full">
                          <AvatarDemo
                            url={connection.avatar_url}
                            initials={getInitials(connection.name)}
                            className="w-24 h-24 text-3xl mb-1"
                          />
                          <div className="font-semibold text-xl text-left w-auto mb-1">
                            {connection.name}
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center w-full px-4 pt-0">
                          <div className="flex flex-wrap gap-1 justify-center mb-2 w-full">
                            {connection.interests?.slice(0, 3).map((interest, idx) => (
                              <span
                                key={idx}
                                className={`text-xs px-2 py-1 rounded ${badgeColors[idx % badgeColors.length]}`}
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground w-full text-center mb-1">
                            Last contact: {connection.last_contact_at ? new Date(connection.last_contact_at).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground w-full text-center">
                            Interactions: {connection.interactions_count}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TopConnectionsCarousel; 