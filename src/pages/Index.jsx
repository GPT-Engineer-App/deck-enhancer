// Complete the Index page component here
// Use chakra-ui
import React, { useState } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, Textarea, VStack, Heading, Text, List, ListItem, ListIcon, useToast } from "@chakra-ui/react";
import { FaPlus, FaCheckCircle } from "react-icons/fa";

const Index = () => {
  const [deckList, setDeckList] = useState("");
  const [analysis, setAnalysis] = useState([]);
  const toast = useToast();

  const handleDeckSubmission = async () => {
    const cards = deckList
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length);
    if (cards.length !== 60) {
      toast({
        title: "Invalid deck",
        description: "Please ensure your deck has exactly 60 cards.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const cardDataPromises = cards.map((card) => fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(card)}`));
      const cardDataResponses = await Promise.all(cardDataPromises);
      const cardData = await Promise.all(cardDataResponses.map((res) => res.json()));

      const deckAnalysis = await fetch("https://api.limitlesstcg.com/v2/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cards: cardData.map((data) => data.data[0].id) }),
      });

      const deckAnalysisResult = await deckAnalysis.json();
      setAnalysis(deckAnalysisResult.recommendations);
    } catch (error) {
      toast({
        title: "Error fetching data",
        description: "There was an error fetching data from the APIs.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={4} align="flex-start">
        <Heading as="h1" size="xl">
          Pokémon TCG Deck Analyzer
        </Heading>
        <Text>Enter your deck list below, one card per line:</Text>
        <FormControl>
          <FormLabel htmlFor="deck-list">Deck List</FormLabel>
          <Textarea id="deck-list" value={deckList} onChange={(e) => setDeckList(e.target.value)} placeholder="Enter each card on a new line" size="sm" />
        </FormControl>
        <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={handleDeckSubmission}>
          Analyze Deck
        </Button>
        {analysis.length > 0 && (
          <>
            <Heading as="h2" size="lg">
              Recommendations
            </Heading>
            <List spacing={3}>
              {analysis.map((recommendation, index) => (
                <ListItem key={index}>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  {recommendation}
                </ListItem>
              ))}
            </List>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
