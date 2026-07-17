import { BiIcon, EmptySection, SignInInterceptor } from "@/shared/utils";
import { AddDialog } from "../modules/add";

export const EmptyCompare = ({
  LoginTrigger,
}: {
  LoginTrigger: SignInInterceptor;
}) => {
  return (
    <EmptySection
      heading="No comparison available"
      text="Enter an amout in SEND above to see what you money is worth in other currencies."
    >
      <LoginTrigger
        className="bg-lime-500 text-background p-4 uppercase mt-8 rounded-lg"
        description="To add comparison currencies you must be logged in first"
        popoverTarget="add-compare-dialog"
      >
        Add to compare <BiIcon name="plus-square" />
      </LoginTrigger>
      <AddDialog />
    </EmptySection>
  );
};
