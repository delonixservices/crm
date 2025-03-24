import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { Event } from '@mui/icons-material';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ActivityDescription = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const CHARACTER_LIMIT = 200;

  // Filter out the price line and process the content
  const processContent = (content) => {
    return content
      .split('\n')
      .filter(line => !line.toLowerCase().startsWith('price:'))
      .join('\n');
  };

  const processedContent = processContent(content);
  const shouldShowButton = processedContent.length > CHARACTER_LIMIT;
  const displayText = isExpanded ? processedContent : processedContent.slice(0, CHARACTER_LIMIT);

  return (
    <Box className="space-y-2">
      {displayText.split('\n').map((line, i) => {
        if (!line.trim()) return null;
        const [key, value] = line.split(': ');
        
        if (!value) return (
          <Typography key={i} className="text-gray-600">
            {line}
          </Typography>
        );

        return (
          <Box key={i} className="flex items-start gap-2">
            <Typography className="font-semibold min-w-[100px]">
              {key}:
            </Typography>
            <Typography className="text-gray-600">
              {value}
            </Typography>
          </Box>
        );
      })}
      {shouldShowButton && (
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800"
          variant="text"
          size="small"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              See More <ChevronDown className="w-4 h-4" />
            </>
          )}
        </Button>
      )}
    </Box>
  );
};

const ActivitiesSection = ({proposal}) => {
  if (!proposal.activities?.length) return null;

  return (
    <Box className="mb-8">
      <Typography className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Event sx={{ mr: 2, color: '#1976d2' }} />
        Daily Activities
      </Typography>
      <div className="flex flex-col space-y-4">
        {proposal.activities.map((activity, index) => (
          <Card key={index} className="bg-gray-50 hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-48 h-36">
                  <img
                    src={activity.image || 'https://www.fibe.in/_next/image/?url=https%3A%2F%2Faltcont.fibe.in%2Fwp-content%2Fuploads%2F2019%2F04%2FBudget-Travel.jpg&w=1920&q=75'}
                    alt={activity.heading}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/placeholder-activity.jpg';
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <Box className="mb-2">
                    <Typography className="text-lg font-semibold text-blue-600">
                      {activity.day}
                    </Typography>
                  </Box>
                  <Typography className="text-xl font-semibold mb-3">
                    {activity.heading}
                  </Typography>
                  <ActivityDescription content={activity.content} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Box>
  );
};

export default ActivitiesSection;