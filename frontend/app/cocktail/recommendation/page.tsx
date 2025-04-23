import { Suspense } from "react";
import CocktailRecommendation from "@/components/pages/CocktailRecommendation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function RecommendationPage() {
	return (
		<Suspense
			fallback={
				<div className="flex justify-center items-center h-screen">
					<LoadingSpinner />
				</div>
			}
		>
			<CocktailRecommendation />
		</Suspense>
	);
}
