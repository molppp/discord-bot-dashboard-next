import { Center, Flex, Heading, Link, SimpleGrid, Text, Button, Icon } from '@chakra-ui/react';
import { LoadingPanel } from '@/components/panel/LoadingPanel';
import { QueryStatus } from '@/components/panel/QueryPanel';
import { config } from '@/config/common';
import { guild as view } from 'config/translations/guild';
import { BsMailbox } from 'react-icons/bs';
import { FaRobot } from 'react-icons/fa';
import { useGuildInfoQuery } from 'stores';
import { useColors } from '@/theme';
import { useRouter } from 'next/router';
import { getFeatures } from '@/config/utils';
import { Banner } from '@/components/Banner';
import { FeatureItem } from '@/components/feature/FeatureItem';
import type { CustomGuildInfo } from '@/config/types/custom-types';
import { NextPageWithLayout } from 'pages/_app';
import getGuildLayout from '@/components/layouts/guild/get-guild-layout';

const GuildPage: NextPageWithLayout = () => {
  const t = view.useTranslations();
  const guild = useRouter().query.guild as string;
  const query = useGuildInfoQuery(guild);

  return (
    <QueryStatus query={query} loading={<LoadingPanel size="sm" />} error={t.error.load}>
      {query.data != null ? <GuildPanel guild={guild} info={query.data} /> : <NotJoined />}
    </QueryStatus>
  );
};

function GuildPanel({ guild: id, info }: { guild: string; info: CustomGuildInfo }) {
  const t = view.useTranslations();

  return (
    <Flex direction="column" gap={5}>
      <Banner />
      <Flex direction="column" gap={4}>
        <Heading fontSize="2xl">{t.features}</Heading>
        <SimpleGrid minChildWidth="328px" gap={3}>
          {getFeatures().map((feature) => (
            <FeatureItem
              key={feature.id}
              guild={id}
              feature={feature}
              enabled={info.enabledFeatures.includes(feature.id)}
            />
          ))}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}

function NotJoined() {
  const t = view.useTranslations();
  const { textColorSecondary } = useColors();

  return (
    <Center flexDirection="column" gap={3} h="full" p={5}>
      <Icon as={BsMailbox} w={50} h={50} />
      <Text fontSize="xl" fontWeight="600">
        {t.error['not found']}
      </Text>
      <Text textAlign="center" color={textColorSecondary}>
        {t.error['not found description']}
      </Text>
      <Link href={config.inviteUrl} target="_blank">
        <Button variant="brand" leftIcon={<FaRobot />}>
          {t.bn.invite}
        </Button>
      </Link>
    </Center>
  );
}

GuildPage.auth = true;
GuildPage.getLayout = (c) => getGuildLayout({ children: c });
export default GuildPage;