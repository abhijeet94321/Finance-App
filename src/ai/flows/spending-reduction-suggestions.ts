'use server';
/**
 * @fileOverview An AI agent that analyzes spending data and provides personalized recommendations for reducing expenses.
 *
 * - getSpendingReductionSuggestions - A function that handles the spending analysis and suggestion generation process.
 * - SpendingReductionSuggestionsInput - The input type for the getSpendingReductionSuggestions function.
 * - SpendingReductionSuggestionsOutput - The return type for the getSpendingReductionSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransactionSchema = z.object({
  date: z.string().describe('The date of the transaction in YYYY-MM-DD format.'),
  description: z.string().describe('A brief description of the transaction.'),
  amount: z.number().describe('The monetary amount of the transaction.'),
  type: z.enum(['income', 'expense']).describe('The type of transaction, either income or expense.'),
  category: z.string().describe('The category of the transaction (e.g., Groceries, Rent, Entertainment).'),
});

const SpendingReductionSuggestionsInputSchema = z.object({
  transactions: z.array(TransactionSchema).describe('An array of historical financial transactions.'),
  monthlyIncome: z.number().optional().describe('The user\'s optional monthly income for context.'),
  financialGoals: z.string().optional().describe('The user\'s optional financial goals (e.g., "save ₹5000/month for a down payment").'),
});
export type SpendingReductionSuggestionsInput = z.infer<typeof SpendingReductionSuggestionsInputSchema>;

const SuggestionSchema = z.object({
  category: z.string().describe('The spending category the recommendation applies to.'),
  recommendation: z.string().describe('An actionable recommendation for reducing expenses in the specified category.'),
  potentialSavings: z.string().describe('An estimate of potential monthly savings from implementing this recommendation (e.g., "₹500/month", "10% of current spend").'),
  reasoning: z.string().describe('The reasoning behind why this recommendation is being made based on the provided data.'),
});

const SpendingReductionSuggestionsOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema).describe('An array of personalized and actionable spending reduction suggestions.'),
});
export type SpendingReductionSuggestionsOutput = z.infer<typeof SpendingReductionSuggestionsOutputSchema>;

export async function getSpendingReductionSuggestions(
  input: SpendingReductionSuggestionsInput
): Promise<SpendingReductionSuggestionsOutput> {
  return spendingReductionSuggestionsFlow(input);
}

const spendingReductionPrompt = ai.definePrompt({
  name: 'spendingReductionPrompt',
  input: { schema: SpendingReductionSuggestionsInputSchema },
  output: { schema: SpendingReductionSuggestionsOutputSchema },
  prompt: `You are a financial AI advisor named Saldo, dedicated to helping users reduce their expenses in India.
Analyze the provided historical spending transactions and, if available, consider the user's monthly income and financial goals. All amounts are in Indian Rupees (INR/₹).

Your task is to provide personalized and actionable recommendations for reducing expenses.
Each recommendation should include the spending category it applies to, a clear action, an estimate of potential monthly savings in Rupees, and the reasoning based on the provided data.

Transactions:
{{#each transactions}}
  - Date: {{{date}}}, Description: {{{description}}}, Amount: ₹{{{amount}}}, Type: {{{type}}}, Category: {{{category}}}
{{/each}}

{{#if monthlyIncome}}
Monthly Income: ₹{{{monthlyIncome}}}
{{/if}}

{{#if financialGoals}}
Financial Goals: {{{financialGoals}}}
{{/if}}

Based on this information, provide a list of spending reduction suggestions. Be specific and actionable. Ensure all currency formatting uses the ₹ symbol.
`,
});

const spendingReductionSuggestionsFlow = ai.defineFlow(
  {
    name: 'spendingReductionSuggestionsFlow',
    inputSchema: SpendingReductionSuggestionsInputSchema,
    outputSchema: SpendingReductionSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await spendingReductionPrompt(input);
    return output!;
  }
);
