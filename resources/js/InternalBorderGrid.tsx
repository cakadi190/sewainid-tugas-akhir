import styled from "@emotion/styled";
import React, { createContext, useContext } from "react";

interface GridContextType {
  cols: number;
  textAlign: "left" | "center" | "right";
}

const GridContext = createContext<GridContextType>({
  cols: 3,
  textAlign: "left",
});

export const GridContainer: React.FC<
  {
    cols?: number;
    children: React.ReactNode;
    textAlign?: "left" | "center" | "right";
  } & React.HTMLAttributes<HTMLDivElement>
> = ({ cols = 3, children, textAlign = "left", ...props }) => {
  return (
    <GridContext.Provider value={{ cols, textAlign }}>
      <StyledGridContainer {...props} cols={cols}>
        {children}
      </StyledGridContainer>
    </GridContext.Provider>
  );
};

const StyledGridContainer = styled.div<{ cols: number }>`
  display: grid;
  grid-template-columns: 1fr;

  @media (min-width: 992px) {
    grid-template-columns: repeat(${(props) => props.cols}, 1fr);
  }
`;

export const GridItem: React.FC<{
  children: React.ReactNode;
  index?: number;
  total?: number;
}> = ({ children }) => {
  const { cols, textAlign } = useContext(GridContext);

  const StyledItem = styled.div`
    padding: 20px;
    text-align: ${textAlign};
    border-bottom: 1px solid #ddd;

    &:last-child {
      border-bottom: none;
    }

    @media (min-width: 992px) {
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;

      &:nth-of-type(${cols}n) {
        border-right: none;
      }

      &:nth-last-of-type(-n + ${cols}) {
        border-bottom: none;
      }
    }
  `;

  return <StyledItem>{children}</StyledItem>;
};
