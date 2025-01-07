export interface UserInteraction {
    interactionType: 'HOVER' | 'CLICKED' | 'ORDERED' | 'PUT_IN_CART' | 'REVIEWED',
    startDate: Date,
    endDate: Date,
    productId: number,
}

export const saveInteractions = (productId: number, interactionType: 'HOVER' | 'CLICKED' | 'ORDERED' | 'PUT_IN_CART' | 'REVIEWED', isLeave = false) => {
    const interactionsKey = "userInteractions";

    // Retrieve existing interactions from localStorage
    const storedInteractions = localStorage.getItem(interactionsKey);
    const interactions: UserInteraction[] = storedInteractions ? JSON.parse(storedInteractions) : [];

    if (interactionType === "HOVER") {
        if (!isLeave) {
            // Add a new hover interaction on mouse enter
            interactions.push({
                productId,
                interactionType: "HOVER",
                startDate: new Date(),
                endDate: new Date()
            });
        } else {
            // Update the leaveTimestamp for the last hover interaction for this product
            const lastHoverInteraction = interactions
                .reverse()
                .find(
                    (interaction) => interaction.productId === productId && interaction.interactionType === "HOVER" && !interaction.endDate
                );

            if (lastHoverInteraction) {
                lastHoverInteraction.endDate = new Date();
            }
            interactions.reverse(); // Revert order back
        }
    } else {
        // Add a new click interaction
        interactions.push({
            productId,
            interactionType: interactionType,
            startDate: new Date(),
            endDate: new Date(),
        });
    }


    // Save updated interactions back to localStorage
    localStorage.setItem(interactionsKey, JSON.stringify(interactions));
};