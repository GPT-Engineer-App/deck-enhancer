// Complete the Index page component here
// Use chakra-ui
import React, { useState } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, Textarea, VStack, Heading, Text, List, ListItem, ListIcon, useToast } from "@chakra-ui/react";
import { FaPlus, FaCheckCircle } from "react-icons/fa";

const Index = () => {
  const [deckList, setDeckList] = useState("");
  const [analysis, setAnalysis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleDeckSubmission = async () => {
    const sectionHeaders = ["Pokémon:", "Trainer:", "Energy:"];
    const cards = deckList
      .split("\n")
      .filter((line) => /^\d+\s+\D/.test(line.trim()))
      .map((line) => {
        let parts = line.split(" ");
        let quantity = parseInt(parts[0]);
        let id = parts.pop();
        let setCode = parts.pop();
        let cardName = parts.slice(1).join(" ");
        return {
          quantity: quantity,
          name: encodeURIComponent(cardName.trim()),
          id: id,
          setCode: setCode,
        };
      });
    const totalCards = cards.reduce((acc, card) => acc + card.quantity, 0);
    if (totalCards !== 60) {
      toast({
        title: "Invalid deck",
        description: "Please ensure your deck list format is correct and totals to 60 cards.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const cardDataPromises = cards.map((card) => fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(card)}`));
      const cardDataResponses = await Promise.all(cardDataPromises);
      const cardData = await Promise.all(cardDataResponses.map((res) => res.json()));
      setIsLoading(false);

      const deckAnalysis = await fetch("https://api.limitlesstcg.com/v2/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cards: cardData.map((data) => data.data[0].id) }),
      });

      if (!deckAnalysis.ok) throw new Error("Failed to analyze deck.");
      const deckAnalysisResult = await deckAnalysis.json();
      setAnalysis(deckAnalysisResult.recommendations);
    } catch (error) {
      toast({
        title: "Error fetching data",
        description: error.message || "There was an error fetching data from the APIs.",
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
        <Text>Enter your deck list below, with the quantity followed by the card name on each line:</Text>
        <FormControl>
          <FormLabel htmlFor="deck-list">Deck List</FormLabel>
          <Textarea id="deck-list" value={deckList} onChange={(e) => setDeckList(e.target.value)} placeholder="Enter each card on a new line" size="sm" />
        </FormControl>
        <Button leftIcon={<FaPlus />} colorScheme="teal" isLoading={isLoading} onClick={handleDeckSubmission}>
          Analyze Deck
        </Button>
        <Button
          colorScheme="red"
          onClick={() => {
            setDeckList("");
            setAnalysis([]);
          }}
        >
          Clear Results
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
