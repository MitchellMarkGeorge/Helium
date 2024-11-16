import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { ChevronDown, ChevronRight } from "react-bootstrap-icons";
import Text from "renderer/components/ui/Text";

interface Props extends PropsWithChildren {
  title: string;
  fullHeight?: boolean;
}

function FileExplorerSection({ title, fullHeight = false, children }: Props) {
  const sectionClasses = classNames("file-explorer-section", {
    full: fullHeight,
  });
  return (
    <Disclosure as="div" className={sectionClasses}>
      {({ open }) => (
        <>
          <DisclosureButton className="file-explorer-section-trigger">
            <Text size="xs" className="file-explorer-section-title">
              {title}
            </Text>
            {open ? (
              <ChevronDown className="file-explorer-section-icon" />
            ) : (
              <ChevronRight className="file-explorer-section-icon" />
            )}
          </DisclosureButton>
          <DisclosurePanel className="file-explorer-section-panel">
            {children}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}

export default FileExplorerSection;
