import { Heading, Section } from "@/shared/heading";
import { BiIcon, LoginTrigger, SROnly } from "@/shared/utils";
import { Actions } from "./Actions";
import { CompareCurreny } from "./CompareCurreny";

export const MainCompare = ({
  LoginTrigger,
}: {
  LoginTrigger: LoginTrigger;
}) => {
  return (
    <Section aria-describedby="compare-description" className="p-4">
      <div className="flex flex-wrap rounded-lg p-4 gap-4 bg-background-secondary items-center justify-between">
        <Heading id="compare-heading" className="uppercase">
          <SROnly>Compare </SROnly>{" "}
          <span className="text-foreground-secondary"> Multi-Currencies</span>{" "}
          1000 FROM USD
        </Heading>
        <Actions>
          <LoginTrigger
            className="bg-card p-2 rounded-lg"
            description="Login to use the add currency to compare list feature and many more options."
          >
            <SROnly>Add currency to compare list</SROnly>
            <BiIcon name="plus" />
          </LoginTrigger>
        </Actions>
        <ul className="w-full">
          <CompareCurreny>
            <LoginTrigger description="Login to use the remove currency from compare list feature and many more options.">
              <SROnly> Remove from compare</SROnly> <BiIcon name="trash" />
            </LoginTrigger>
          </CompareCurreny>
        </ul>
      </div>
    </Section>
  );
};
