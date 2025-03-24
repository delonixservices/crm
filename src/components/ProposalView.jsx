import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.jpg';
import { useParams, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import scannerImage from '../assets/scan.jpeg';
import { CurrencyRupee } from '@mui/icons-material';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ActivitiesSection from './ActivitiesSection';  // adjust the path as needed
import { Hotel } from '@mui/icons-material';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Container,
  IconButton,
  Tooltip,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  FlightTakeoff,
  LocationOn,
  DateRange,
  Phone,
  Event,
  AttachMoney,
  Info,
  Notes,
  Article,
  ExpandMore,
  ExpandLess,
  PictureAsPdf,
  Edit,
  LocalHospital
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ProposalView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedActivities, setExpandedActivities] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const [flightImage, setFlightImage] = useState(null);
  const [hotelImage, setHotelImage] = useState(null);
  const [activityImages, setActivityImages] = useState({});
  const [travelInsurance, setTravelInsurance] = useState('');
  const [destinationImage, setDestinationImage] = useState([]);

  // Unsplash API key (consider moving this to environment variables)
  const unsplashAccessKey = "fWPv-yqPLIO_V_N3R3BiIJGZ_O743dKtUByC5Rr8LAI";


  // First, fix the fetchUnsplashImage function to handle errors better
  useEffect(() => {
    const fetchDestinationImages = async () => {
      if (!proposal?.clientInfo?.destinationAreas) return;

      try {
        // Handle both array and string cases for backward compatibility
        const destinations = Array.isArray(proposal.clientInfo.destinationAreas)
          ? proposal.clientInfo.destinationAreas
          : [{ cityName: proposal.clientInfo.destinationAreas }];

        const imagePromises = destinations.map(async (destination) => {
          const cityName = typeof destination === 'string' ? destination : destination.cityName;

          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cityName)}&client_id=${unsplashAccessKey}&orientation=landscape&per_page=1`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch image for ${cityName}`);
          }

          const data = await response.json();
          return {
            cityName,
            imageUrl: data.results?.[0]?.urls?.regular
          };
        });

        const images = await Promise.all(imagePromises);
        setDestinationImages(images.filter(img => img.imageUrl));

        // Set the first image as the main image for backward compatibility
        if (images[0]?.imageUrl) {
          setImageUrl(images[0].imageUrl);
        }
      } catch (error) {
        console.error('Error fetching destination images:', error);
      }
    };

    fetchDestinationImages();
  }, [proposal?.clientInfo?.destinationAreas]);


  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/proposals/${id}`);
        if (!response.ok) throw new Error('Failed to fetch proposal');
        const data = await response.json();
        setProposal(data);
        setLoading(false);
        setTravelInsurance(data.travelInsurance || '');

        // Fetch destination image
        if (data.clientInfo?.destinationAreas) {
          const destImage = await fetchUnsplashImage(data.clientInfo.destinationAreas);
          setImageUrl(destImage);
        }

        // Fetch flight image
        const flightImg = await fetchUnsplashImage('airport terminal airplane');
        setFlightImage(flightImg);
      } catch (error) {
        console.error('Error fetching proposal:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchProposal();
    }
  }, [id]);


  const fetchUnsplashImage = async (query) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${unsplashAccessKey}&orientation=landscape&per_page=1`
      );
      if (!response.ok) return null;
      const data = await response.json();
      return data.results?.[0]?.urls?.regular;
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };




  // Calculate total days
  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  // Handle Edit Proposal
  const handleEditProposal = () => {
    navigate(`/proposals/edit/${id}`);
  };

  // Modified JSX for Flights section
  const FlightsSection = () => (
    proposal.flights && proposal.flights.length > 0 && (
      <Box mb={3}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FlightTakeoff sx={{ mr: 2, color: '#1976d2' }} />
          Flights
        </Typography>
        {flightImage && (
          <Box mb={2}>
            <img
              src={flightImage}
              alt="Flight"
              style={{
                width: '30%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </Box>
        )}
        {proposal.flights.map((flight, index) => (
          <Typography key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            • {flight}
          </Typography>
        ))}
      </Box>
    )
  );

  // Hotel Section
  const HotelSection = () => {
    if (!proposal.hotelInfo?.hotels?.length) return null;

    return (
      <Box className="mb-8">
        <Typography className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Hotel sx={{ mr: 2, color: '#1976d2' }} />
          Hotel Information
        </Typography>

        {proposal.hotelInfo.hotels.map((hotel, index) => (
          <Card key={index} className="mb-4 bg-gray-50">
            <CardContent className="p-4">
              <Grid className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hotel.image && (
                  <Box className="relative h-48">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Box className="absolute top-2 right-2">
                      <Box className="bg-white px-2 py-1 rounded-full shadow text-sm font-semibold">
                        {hotel.starRating} ★
                      </Box>
                    </Box>
                  </Box>
                )}
                <Box className="md:col-span-2 space-y-3">
                  <Typography className="text-xl font-semibold">{hotel.name}</Typography>
                  <Typography className="text-gray-600">{hotel.description}</Typography>
                  <Box>
                    <Typography className="font-semibold mb-2">Room Type: {hotel.propertyType}</Typography>
                    <Typography className="font-semibold mb-2">Meal Plan: {hotel.mealPlan}</Typography>
                  </Box>
                  <Box className="flex flex-wrap gap-2">
                    {hotel.selectedAmenities?.map((amenity, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };



  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/proposals/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch proposal');
        }
        const data = await response.json();
        setProposal(data);
        setLoading(false);
        setTravelInsurance(data.travelInsurance || ''); // Set initial travel insurance state

        // Fetch destination image from Unsplash
        if (data.clientInfo?.destinationAreas) {
          const destination = data.clientInfo.destinationAreas;
          const imageResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${destination}&client_id=${unsplashAccessKey}&orientation=landscape&per_page=1`
          );
          const imageData = await imageResponse.json();
          setImageUrl(imageData.results[0]?.urls?.full || null);
        }
      } catch (error) {
        console.error('Error fetching proposal:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchProposal();
    }
  }, [id]);
  //handle email 
  const handleSendEmailWithPDF = async () => {
    try {
        const element = document.getElementById('proposal-content');
        if (!element) {
            alert('Proposal content not found.');
            return;
        }

        const pdfBlob = await html2pdf()
            .set({
                margin: [20, 20, 20, 20],
                filename: `${proposal.clientInfo.name}_trip_to_${proposal.clientInfo.destinationAreas}.pdf`,
                image: { type: 'jpeg', quality: 1, scale: 5 },
                html2canvas: {
                    scale: 5,
                    useCORS: true,
                    logging: false,
                    allowTaint: true,
                    scrollX: 0,
                    scrollY: -window.scrollY,
                    windowWidth: document.documentElement.offsetWidth,
                    windowHeight: document.documentElement.scrollHeight,
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                    compress: true,
                    putOnlyUsedFonts: true,
                },
                pagebreak: {
                    mode: 'avoid-all',
                    before: '.page-break-before',
                    after: '.page-break-after',
                },
            })
            .from(element)
            .output('blob');

        // Convert Blob to Base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64data = reader.result.split(',')[1]; // Get base64 string
            const formData = {
                to: 'recipient@example.com',
                subject: 'Your Proposal',
                text: 'Please find the attached proposal.',
                html: '<b>Attached is your PDF</b>',
                attachment: base64data
            };

            // Send the email via your backend endpoint
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sendemail'`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Email sent successfully!');
            } else {
                const errorMessage = await response.text();
                console.error('Failed to send email:', errorMessage);
                alert('Failed to send email. Please try again.');
            }
        };
        reader.readAsDataURL(pdfBlob); // Convert Blob to Base64
    } catch (error) {
        console.error('Error while generating or sending email with PDF:', error);
        alert('Failed to send email with PDF. Please try again.');
    }
};
  
  // Update PDF generation to handle full content and travel insurance
  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('proposal-content');
      if (!element) {
        alert('Proposal content not found.');
        return;
      }
  
      const pdfDataUri = await html2pdf()
        .set({
          margin: [20, 20, 20, 20],
          filename: `${proposal.clientInfo.name}_trip_to_${proposal.clientInfo.destinationAreas}.pdf`,
          image: { type: 'jpeg', quality: 1, scale: 5 },
          html2canvas: {
            scale: 5,
            useCORS: true,
            logging: false,
            allowTaint: true,
            scrollX: 0,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.scrollHeight,
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
            compress: true,
            putOnlyUsedFonts: true,
          },
          pagebreak: {
            mode: 'avoid-all',
            before: '.page-break-before',
            after: '.page-break-after',
          },
        })
        .from(element)
        .outputPdf('datauristring');
  
      const existingPdfBytes = await fetch(pdfDataUri).then(res => res.arrayBuffer());
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
      // Add a new page for bank details and scanner
      const newPage = pdfDoc.addPage();
      const { width, height } = newPage.getSize();
  
      // Embed fonts
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
      // Embed images with proper error handling
      const embedImage = async (url) => {
        try {
          const imageBytes = await fetch(url).then((res) => res.arrayBuffer());
          return url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.jpeg')
            ? await pdfDoc.embedJpg(imageBytes)
            : await pdfDoc.embedPng(imageBytes);
        } catch (error) {
          console.error(`Failed to embed image from ${url}:`, error);
          return null;
        }
      };
  
      const logoImage = await embedImage(logo);
      const qrCodeImage = await embedImage(scannerImage);
  
      // Calculate safe zones for content
      const safeZoneX = 30;
      const safeZoneY = 30;
      const safeWidth = width - (2 * safeZoneX);
      const safeHeight = height - (2 * safeZoneY);
  
      // Process all pages with safe zones
      const pages = pdfDoc.getPages();
      pages.forEach((page, index) => {
        // Draw border with padding
        page.drawRectangle({
          x: safeZoneX - 10,
          y: safeZoneY - 10,
          width: safeWidth + 20,
          height: safeHeight + 20,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
          opacity: 0.5
        });
  
        // Add logo with proper scaling
        if (logoImage) {
          const maxLogoWidth = 40;
          const logoWidth = Math.min(maxLogoWidth, safeWidth * 0.2);
          const logoHeight = (logoWidth * logoImage.height) / logoImage.width;
          page.drawImage(logoImage, {
            x: width - logoWidth - safeZoneX,
            y: height - logoHeight - safeZoneY,
            width: logoWidth,
            height: logoHeight
          });
        }
  
        // Add website button with proper text wrapping
        const websiteText = 'Visit Our Website: www.tripbazaar.in';
        const fontSize = 12;
        const websiteTextWidth = helveticaFont.widthOfTextAtSize(websiteText, fontSize);
  
        const buttonWidth = Math.min(websiteTextWidth + 20, safeWidth);
        const buttonX = (width - buttonWidth) / 2;
  
        page.drawRectangle({
          x: buttonX,
          y: safeZoneY + 15,
          width: buttonWidth,
          height: 20,
          color: rgb(0.1, 0.47, 0.82),
          borderWidth: 1,
          opacity: 1
        });
  
        page.drawText(websiteText, {
          x: buttonX + (buttonWidth - websiteTextWidth) / 2,
          y: safeZoneY + 20,
          size: fontSize,
          font: helveticaFont,
          color: rgb(1, 1, 1)
        });
  
        // Add page numbers
        const pageText = `Page ${index + 1} of ${pages.length}`;
        const pageNumWidth = helveticaFont.widthOfTextAtSize(pageText, 10);
        page.drawText(pageText, {
          x: width - pageNumWidth - safeZoneX,
          y: safeZoneY + 20,
          size: 10,
          font: helveticaFont,
          color: rgb(0.5, 0.5, 0.5)
        });
  
        // Add title to first page with proper wrapping
        if (index === 0) {
          const headerText = `${proposal.clientInfo.name}'s Visit to ${proposal.clientInfo.destinationAreas}`;
          const headerSize = 25;
          const headerWidth = helveticaFont.widthOfTextAtSize(headerText, headerSize);
  
          const finalHeaderSize = headerWidth > safeWidth ? (headerSize * safeWidth / headerWidth) : headerSize;
          const finalHeaderWidth = helveticaFont.widthOfTextAtSize(headerText, finalHeaderSize);
  
          page.drawText(headerText, {
            x: (width - finalHeaderWidth) / 2,
            y: height - 50,
            size: finalHeaderSize,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          });
        }
  
        // Add scanner and bank details to the last page with proper spacing
        if (index === pages.length - 1) {
          const paymentTitle = 'Payment Details';
          const titleWidth = helveticaBold.widthOfTextAtSize(paymentTitle, 20);
          page.drawText(paymentTitle, {
            x: (width - titleWidth) / 2,
            y: height - 100,
            size: 20,
            font: helveticaBold,
            color: rgb(0, 0, 0)
          });
  
          if (qrCodeImage) {
            const maxScannerWidth = Math.min(200, safeWidth * 0.8);
            const scannerWidth = Math.min(maxScannerWidth, safeWidth);
            const scannerHeight = (scannerWidth * qrCodeImage.height) / qrCodeImage.width;
  
            const scannerY = height - 150 - scannerHeight;
            if (scannerY >= safeZoneY + 100) {
              page.drawImage(qrCodeImage, {
                x: (width - scannerWidth) / 2,
                y: scannerY,
                width: scannerWidth,
                height: scannerHeight
              });
  
              // Add bank details with proper spacing
              const bankDetails = [
                { text: 'TRIPBAZAAR', isBold: true },
                { text: 'Bank- SBI', isBold: false },
                { text: 'A/C NO. - 42554089805', isBold: false },
                { text: 'IFSC - SBIN0013404', isBold: false },
                { text: 'tripbazaarholidays@sbi', isBold: false },
                { text: 'you can use this upi id for payment.', isBold: false },
                { text: '7678105666-2@okbizaxis', isBold: false },
                { text: 'email: support@tripbazaar.in', isBold: false }
              ];
  
              let yPos = scannerY - 30;
              const lineSpacing = 25;
  
              bankDetails.forEach((detail) => {
                const font = detail.isBold ? helveticaBold : helveticaFont;
                const fontSize = detail.isBold ? 14 : 12;
                const textWidth = font.widthOfTextAtSize(detail.text, fontSize);
  
                if (yPos >= safeZoneY + 30) {
                  page.drawText(detail.text, {
                    x: (width - textWidth) / 2,
                    y: yPos,
                    size: fontSize,
                    font: font,
                    color: rgb(0, 0, 0)
                  });
                  yPos -= lineSpacing;
                }
              });
            }
          }
        }
      });
  
      // Save and download the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${proposal.clientInfo.name}_trip_to_${proposal.clientInfo.destinationAreas}.pdf`;
      link.click();
  
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6">Loading Proposal...</Typography>
      </Box>
    );
  }

  if (!proposal) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6">No Proposal Found</Typography>
      </Box>
    );
  }

  // Calculate total days
  const totalDays = proposal.clientInfo ?
    calculateTotalDays(proposal.clientInfo.startDate, proposal.clientInfo.endDate)
    : 0;




  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            mt: 4,
            boxShadow: 3,
            borderRadius: 2
          }}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#1976d2'
                }}
              >
                Travel Itinerary
              </Typography>
              <Tooltip title="Edit Proposal">
                <IconButton
                  color="primary"
                  onClick={handleEditProposal}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>

          <CardContent id="proposal-content">
            {/* Destination Image */}
            {imageUrl && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={3}
                sx={{ maxWidth: "100%", overflow: "hidden" }}
              >
                <img
                  src={imageUrl}
                  alt="Destination"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Phone sx={{ mr: 2, color: '#1976d2' }} />
                  <Typography variant="subtitle1">
                    <strong>Name:</strong> {proposal.clientInfo.name}
                  </Typography>
                </Box>


                <Box display="flex" alignItems="center" mb={2}>
                  <Phone sx={{ mr: 2, color: '#1976d2' }} />
                  <Typography variant="subtitle1">
                    <strong>Proposal Name:</strong> {proposal.clientInfo.proposalName}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Phone sx={{ mr: 2, color: '#1976d2' }} />
                  <Typography variant="subtitle1">
                    <strong>Contact:</strong> {proposal.clientInfo.phone}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOn sx={{ mr: 2, color: '#1976d2' }} />
                  <Typography variant="subtitle1">
                    <strong>Start City:</strong> {proposal.clientInfo.startCity}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOn sx={{ mr: 2, color: '#1976d2' }} />
                  <Typography variant="subtitle1">
                    <strong>Destination:</strong> {proposal.clientInfo.destinationAreas}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Travel Dates */}
            <Box display="flex" justifyContent="center" mb={3}>
              <Box display="flex" alignItems="center" mr={3}>
                <DateRange sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="subtitle1">
                  <strong>Start Date:</strong> {new Date(proposal.clientInfo.startDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mr={3}>
                <DateRange sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="subtitle1">
                  <strong>End Date:</strong> {new Date(proposal.clientInfo.endDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <DateRange sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="subtitle1">
                  <strong>Total Days:</strong> {totalDays}
                </Typography>
              </Box>
            </Box>

            {/* Flights */}
            <FlightsSection />

            <HotelSection />

            <ActivitiesSection proposal={proposal} />

            {/* Inclusions */}
            {proposal.inclusions && proposal.inclusions.length > 0 && (
              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <CurrencyRupee sx={{ mr: 2, color: '#1976d2' }} />
                  Inclusions
                </Typography>
                {proposal.inclusions.map((inclusion, index) => (
                  <Typography
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      color: '#1976d2'
                    }}
                  >
                    • {inclusion}
                  </Typography>
                ))}
              </Box>
            )}


            {/* Exclusions */}
            {proposal.exclusions && proposal.exclusions.length > 0 && (
              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Info sx={{ mr: 2, color: '#1976d2' }} />
                  Exclusions
                </Typography>
                {proposal.exclusions.map((exclusion, index) => (
                  <Typography
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      color: '#d32f2f'
                    }}
                  >
                    • {exclusion}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Visa Information */}
            {proposal.visa && (
              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Notes sx={{ mr: 2, color: '#1976d2' }} />
                  Visa Information
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Type:</strong> {proposal.visa.type}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Notes:</strong> {proposal.visa.notes}
                </Typography>
              </Box>
            )}

            {/* Terms and Conditions */}
            {proposal.termsAndConditions && proposal.termsAndConditions.include === 'yes' && (
              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Article sx={{ mr: 2, color: '#1976d2' }} />
                  Terms and Conditions
                </Typography>
                <Typography variant="body2">
                  {proposal.termsAndConditions.text}
                </Typography>
              </Box>
            )}


            {/* Travel Insurance */}
            {proposal.travelInsurance && proposal.travelInsurance.include === 'yes' ? (
              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Article sx={{ mr: 2, color: '#1976d2' }} />
                  Travel Insurance
                </Typography>
                <Typography variant="body2">
                  Travel Insurance (covering Medical, Baggage Loss, Flight Cancellations, or Delays) - Only for Age Below 60 Yrs
                </Typography>
                {proposal.travelInsurance.text && (
                  <Typography variant="body2">{proposal.travelInsurance.text}</Typography>
                )}
              </Box>
            ) : (
              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Article sx={{ mr: 2, color: '#1976d2' }} />
                  Travel Insurance
                </Typography>
                <Typography variant="body2">Not Included</Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* PDF Download Button */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PictureAsPdf />}
            onClick={handleDownloadPDF}
            sx={{ mr: 2 }}
          >
            Download PDF
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Edit />}
            onClick={handleEditProposal}
          >
            Edit Proposal
          </Button>
          {/* Send Email Button */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleSendEmailWithPDF}
            sx={{ ml: 2 }}
          >
            Send Email
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default ProposalView;

