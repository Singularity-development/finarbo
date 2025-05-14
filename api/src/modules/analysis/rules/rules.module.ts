import { ProvidersModule } from 'src/providers/providers.module';
import { Module, Provider } from '@nestjs/common';
import { AlternativeCryptoRuleService } from './crypto/alternative-crypto-rule.service';
import { IRule, RULE_SERVICES } from './rule';
import { ShitCoinRuleService } from './crypto/shit-coin-rule.service';
import { RulesService } from './rules.service';
import { AssetTypeConcentrationRuleService } from './market/asset-type-concentration-rule.service';
import { DevaluationRuleService } from './market/devaluation-rule.service';
import { PublicRiskRuleService } from './market/public-risk-rule.service';
import { AssetConcentrationRuleService } from './market/asset-concentration-rule.service';

const ruleServices = [
  AlternativeCryptoRuleService,
  ShitCoinRuleService,
  AssetTypeConcentrationRuleService,
  DevaluationRuleService,
  PublicRiskRuleService,
  AssetConcentrationRuleService,
];

const RuleProviders: Provider[] = [
  ...ruleServices,
  {
    provide: RULE_SERVICES,
    useFactory: (...services: IRule[]) => services,
    inject: [...ruleServices],
  },
];

@Module({
  imports: [ProvidersModule],
  providers: [...RuleProviders, RulesService],
  exports: [RulesService],
})
export class RulesModule {}
